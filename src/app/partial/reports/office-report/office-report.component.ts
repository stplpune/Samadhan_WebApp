import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
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
  selector: 'app-office-report',
  templateUrl: './office-report.component.html',
  styleUrls: ['./office-report.component.css']
})
export class OfficeReportComponent implements OnInit {
  filterForm!: FormGroup;
  officeOffReportArray = new Array();
  dataSource: any;
  pageNo = 1;
  departmentArray = new Array();
  officeArray = new Array();
  displayedColumns: string[] = ['position', 'name', 'OfficeName', 'Received','Open', 'accepted', 'resolved','partialResolved','transfered'];
  minDate = new Date();
  reportArray = new Array();
  getUrl:any;
  todayDate=new Date();
  loggedUserTypeId:any;
  loggedUserDeptID:any;
  loggedUserOffID:any;
  dropdownDisable:boolean=false;
  @ViewChild('formDirective') formDirective!: NgForm;

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
  ) { }

  ngOnInit(): void {
    this.getUrl = this.router.url.split('/')[1];
    this.loggedUserTypeId= this.localStrorageData.getLoggedInLocalstorageData().responseData?.userTypeId;
    this.loggedUserDeptID= this.localStrorageData.getLoggedInLocalstorageData().responseData?.deptId;
    this.loggedUserOffID= this.localStrorageData.getLoggedInLocalstorageData().responseData?.officeId;
    this.filterform();
    this.getDepartment();
    this.getOfficerOfficeReport();
  }

  filterform() {
    this.filterForm = this.fb.group({
      searchdeptId: ['0'],
      searchofcId: ['0'],
      fromDate: [''],
      toDate: ['']
    })
  }


  getDepartment() {
    this.departmentArray = [];
    this.commonService.getAllDepartment().subscribe({
      next: (response: any) => {
        this.departmentArray.push(...response);
        if( this.loggedUserTypeId ==3 || this.loggedUserTypeId ==4){       //  2 logged user userTypeId
          this.filterForm.controls['searchdeptId'].setValue(this.loggedUserDeptID);
          this.getOffice(this.loggedUserDeptID)
          this.dropdownDisable=true;
        }    
      },
      error: ((error: any) => { 
         this.error.handelError(error.statusCode) 
      })
    })
  }

  getOffice(deptNo: number) {
    if (deptNo == 0) {
      return;
    }
    this.officeArray = [];
    this.commonService.getOfficeByDeptId(deptNo).subscribe({
      next: (response: any) => {
        this.officeArray.push(...response);
        if( this.loggedUserTypeId == 4){       //  2 logged user userTypeId
          this.filterForm.controls['searchofcId'].setValue(this.loggedUserOffID);
          this.dropdownDisable=true;
        }    
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }


  getOfficerOfficeReport() {
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

    this.officeOffReportArray=[];
    let obj = formData.searchdeptId + '&searchofcId=' + formData.searchofcId +'&userid=' + this.localStrorageData.getUserId() + '&fromDate=' + formData.fromDate + '&toDate=' + formData.toDate
    this.apiService.setHttp('get', 'api/ShareGrievances/OfficerOfficeReport?searchdeptId=' + obj, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.reportArray=res.responseData
          this.dataSource = new MatTableDataSource(this.reportArray);

          // this.officeOffReportArray = res.responseData.map((ele: any, index: any) => {
          //   ele.deptId = index + 1; delete ele.isDeleted; delete ele.officeId
          //   return ele
          // });

          this.reportArray.map((ele: any, index: any) => {
            let obj={
              'srno':index+1,
              'depertmentName':ele.departmentname,
              'officeName':ele.officeName,
              'received':ele.received,
              'opened':ele.openn,
              // 'rejected':ele.rejected,
              'accepted':ele.accepted,
              'resolved':ele.resolved, 
              'partialResloved':ele.partialResloved,
              'transfered':ele.transfered
            }
              this.officeOffReportArray.push(obj);
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

  clearFilter() {
    this.formDirective.resetForm();
    this.pageNo = 1; 
    if( this.loggedUserTypeId ==3 || this.loggedUserTypeId ==4){       //  2 logged user userTypeId
      this.filterForm.controls['searchdeptId'].setValue(this.loggedUserDeptID);
      this.filterForm.controls['searchofcId'].setValue(0);
      this.dropdownDisable=true;
    }else{
      this.filterForm.controls['searchdeptId'].setValue(0);
      this.filterForm.controls['searchofcId'].setValue(0);
    }
    this.loggedUserTypeId == 4? this.filterForm.controls['searchofcId'].setValue(this.loggedUserOffID) : '';
    
    this.getOfficerOfficeReport();
    this.filterForm.controls['searchdeptId'].setValue('0');
    this.filterForm.controls['searchofcId'].setValue('0');
  }

  downloadExcel() {
    let fromdate:any;
    let todate:any;
    let checkFromDateFlag: boolean = true;
    let checkToDateFlag: boolean = true;
    let formData = this.filterForm.value;
    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';

    let ValueData = this.officeOffReportArray.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name
    let objData:any = {
      'topHedingName': 'Office Report',
      'createdDate':'Created on:'+this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a')
    }
    let keyPDFHeader = ['Sr.No.', "Department Name", "Office Name", "Total Grievances","Open", "Accepted", "Resolved","Partial Resolved","Transferred"];

    checkFromDateFlag = formData.fromDate == '' || formData.fromDate == null || formData.fromDate == 0 || formData.fromDate == undefined ? false : true;
        checkToDateFlag =  formData.toDate == '' ||  formData.toDate == null ||  formData.toDate == 0 ||  formData.toDate == undefined ? false : true;
        if (formData.fromDate &&  formData.toDate && checkFromDateFlag && checkToDateFlag) {
          fromdate = new Date(formData.fromDate);
          todate = new Date( formData.toDate);
          objData.timePeriod = 'From Date:' + this.datePipe.transform(fromdate, 'dd/MM/yyyy') + ' To Date: ' + this.datePipe.transform(todate, 'dd/MM/yyyy');
        }
    this.pdf_excelService.generateExcel(keyPDFHeader, ValueData, objData);
  }

  downloadPdf() {
    let fromdate:any;
    let todate:any;
    let checkFromDateFlag: boolean = true;
    let checkToDateFlag: boolean = true;
    let formData = this.filterForm.value;
    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';

    let keyPDFHeader = ['Sr.No.', "Department Name", "Office Name", "Total Grievances","Open", "Accepted", "Resolved","Partial Resolved","Transferred"];
    let ValueData =
      this.officeOffReportArray.reduce(
        (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
        []
      );// Value Name
      let objData:any = {
        'topHedingName': 'Office Report',
        'createdDate':'Created on:'+this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a')
      }
      
    checkFromDateFlag = formData.fromDate == '' || formData.fromDate == null || formData.fromDate == 0 || formData.fromDate == undefined ? false : true;
    checkToDateFlag =  formData.toDate == '' ||  formData.toDate == null ||  formData.toDate == 0 ||  formData.toDate == undefined ? false : true;
    if (formData.fromDate &&  formData.toDate && checkFromDateFlag && checkToDateFlag) {
      fromdate = new Date(formData.fromDate);
      todate = new Date( formData.toDate);
      objData.timePeriod = 'From Date:' + this.datePipe.transform(fromdate, 'dd/MM/yyyy') + ' To Date: ' + this.datePipe.transform(todate, 'dd/MM/yyyy');
    }
    this.pdf_excelService.downLoadPdf(keyPDFHeader, ValueData, objData);
  }


  // getDetailsReport(ele:any,eleFlag:any){
  //   console.log(ele);
  //   let obj={
  //     'url':this.getUrl,
  //     'flag':eleFlag,
  //     'deptId':ele.deptId,
  //     'officeId':ele.officeId
  //   }

  //   const dialogRef = this.dialog.open(SamadhanReportComponent, {
  //     width: '900px',
  //     height:'650px',
  //     data:obj,
  //     disableClose: true,
  //   });
  //   dialogRef.afterClosed().subscribe((_result: any) => {
      
  //   }); 
  // }

  getDetailsReport(obj:any,onClickflag:any,pageFlag:any){
    this.router.navigate(['samadhan-report', obj.deptId + '.' + onClickflag + '.' + pageFlag + '.' + obj.officeId]); 
  }

}





