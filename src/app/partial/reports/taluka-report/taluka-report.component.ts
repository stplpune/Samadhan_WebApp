import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigService } from 'src/app/configs/config.service';
import { ApiService } from 'src/app/core/service/api.service';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { ExcelService } from 'src/app/core/service/excel_Pdf.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
// import { SamadhanReportComponent } from '../samadhan-report/samadhan-report.component';

@Component({
  selector: 'app-taluka-report',
  templateUrl: './taluka-report.component.html',
  styleUrls: ['./taluka-report.component.css']
})
export class TalukaReportComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name','received','open', 'accepted', 'resolved','partialResolved','transfered'];
  dataSource:any;

  filterForm!: FormGroup;
  OfficerTalukaReportArray = new Array();  
  pageNo = 1;
  talukaArray = new Array();
  reportArray=new Array();
  getUrl:any;
  todayDate=new Date();

  constructor(
    private apiService: ApiService,
    public error: ErrorHandlerService,
    private spinner: NgxSpinnerService,
    public configService: ConfigService,
    public validation: FormsValidationService,
    public localStrorageData: WebStorageService,
    public commonService: CommonApiService,
    public dialog: MatDialog,
    public commonMethod: CommonMethodService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private pdf_excelService: ExcelService,
    private router:Router
  ){

  }

  ngOnInit(): void { 
    this.getUrl = this.router.url.split('/')[1];
    this.getTaluka(1);
    this.filterform();
    this.getOfficerTalukaReport();
  }

  filterform() {
    this.filterForm = this.fb.group({
      TalukaId: ['0'],
      fromDate: [''],
      toDate: ['']
    })
  }

  getTaluka(distId: number) {
    if (distId == 0) {
      return;
    }
    this.talukaArray = [];
    this.commonService.getTalukabyDistId(distId).subscribe({
      next: (response: any) => {
        this.talukaArray.push(...response);
      },
      error: ((error: any) => { this.error.handelError(error.statusCode) })
    })
  }

  getOfficerTalukaReport() {
    this.spinner.show();
    let formData = this.filterForm.value;
    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';

    if(formData.fromDate){
      if(!formData.toDate){
        this.commonMethod.matSnackBar('Please select end date', 1);
        this.spinner.hide();
        return
      } 
    }

    if( formData.fromDate && formData.toDate){
      localStorage.setItem('dateRange',JSON.stringify(formData));
    }
    
    this.OfficerTalukaReportArray=[];
    let obj = formData.TalukaId + '&userid=' + this.localStrorageData.getUserId() + '&fromDate=' + formData.fromDate + '&toDate=' + formData.toDate
    this.apiService.setHttp('get', 'api/ShareGrievances/OfficerTalukaReport?TalukaId=' + obj, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.reportArray=res.responseData;
          this.dataSource = new MatTableDataSource(this.reportArray);

          // this.OfficerTalukaReportArray = res.responseData.map((ele: any, index: any) => {
          //   ele.talukaId = index + 1; delete ele.isDeleted;
          //   return ele
          // });
         

          this.reportArray.map((ele: any, index: any) => {
            let obj={
              'srno':index+1,
              'talukaName':ele.taluka,
              'received':ele.received,
              'opened':ele.openn,
              // 'rejected':ele.rejected,
              'accepted':ele.accepted,
              'resolved':ele.resolved,            
              'partialResloved':ele.partialResloved,
              'transfered':ele.transfered
            }
              this.OfficerTalukaReportArray.push(obj);
           });

          // this.totalPages = res.responseData1.pageCount;
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.dataSource = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          // this.totalPages = 0;
        }
      },
      error: (error: any) => {
        this.error.handelError(error.status);
        this.spinner.hide();
      },
    });
  }

  keyPDFHeader = ['Sr.No.', "Taluka Name","Total Grievances","Open", "Accepted", "Resolved","Partial Resolved","Transferred"];

  downloadExcel() {
    let fromdate:any;
    let todate:any;
    let checkFromDateFlag: boolean = true;
    let checkToDateFlag: boolean = true;
    let formData = this.filterForm.value;
    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';

    let ValueData = this.OfficerTalukaReportArray.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name
    let objData:any = {
      'topHedingName': 'Taluka Report',
      'createdDate':'Created on:'+ this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a')
    }

    checkFromDateFlag = formData.fromDate == '' || formData.fromDate == null || formData.fromDate == 0 || formData.fromDate == undefined ? false : true;
    checkToDateFlag =  formData.toDate == '' ||  formData.toDate == null ||  formData.toDate == 0 ||  formData.toDate == undefined ? false : true;
    if (formData.fromDate &&  formData.toDate && checkFromDateFlag && checkToDateFlag) {
      fromdate = new Date(formData.fromDate);
      todate = new Date( formData.toDate);
      objData.timePeriod = 'From Date:' + this.datePipe.transform(fromdate, 'dd/MM/yyyy') + ' To Date: ' + this.datePipe.transform(todate, 'dd/MM/yyyy');
    }

    this.pdf_excelService.generateExcel(this.keyPDFHeader, ValueData, objData);
  }

  downloadPdf() {
    let fromdate:any;
    let todate:any;
    let checkFromDateFlag: boolean = true;
    let checkToDateFlag: boolean = true;
    let formData = this.filterForm.value;
    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';

    let ValueData =
      this.OfficerTalukaReportArray.reduce(
        (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
        []
      );// Value Name
    let objData:any = {
      'topHedingName': 'Taluka Report',
      'createdDate':'Created on:'+ this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a')
    }

    checkFromDateFlag = formData.fromDate == '' || formData.fromDate == null || formData.fromDate == 0 || formData.fromDate == undefined ? false : true;
    checkToDateFlag =  formData.toDate == '' ||  formData.toDate == null ||  formData.toDate == 0 ||  formData.toDate == undefined ? false : true;
    if (formData.fromDate &&  formData.toDate && checkFromDateFlag && checkToDateFlag) {
      fromdate = new Date(formData.fromDate);
      todate = new Date( formData.toDate);
      objData.timePeriod = 'From Date:' + this.datePipe.transform(fromdate, 'dd/MM/yyyy') + ' To Date: ' + this.datePipe.transform(todate, 'dd/MM/yyyy');
    }

    this.pdf_excelService.downLoadPdf(this.keyPDFHeader, ValueData, objData);
  }

  clearFilter() {
    this.filterform();
    this.pageNo = 1;
    this.getOfficerTalukaReport();
    this.filterForm.controls['TalukaId'].setValue('0');
  }

  // getDetailsReport(ele:any,eleFlag:any){
  //   console.log(ele);
  //   let obj={
  //     'url':this.getUrl,
  //     'flag':eleFlag,
  //     'talukaId':ele.talukaId
  //   }

  //   const dialogRef = this.dialog.open(SamadhanReportComponent, {
  //     width: '100%',
  //     height:'650px',
  //     data:obj,
  //     disableClose: true,
  //   });
  //   dialogRef.afterClosed().subscribe((_result: any) => {
      
  //   }); 
  // }


  getDetailsReport(obj:any,onClickflag:any,pageFlag:any){
    this.router.navigate(['samadhan-report', obj.talukaId + '.' + onClickflag + '.' + pageFlag]); 
  }


}

