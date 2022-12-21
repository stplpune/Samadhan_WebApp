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
  selector: 'app-pendency-report',
  templateUrl: './pendency-report.component.html',
  styleUrls: ['./pendency-report.component.css']
})
export class PendencyReportComponent implements OnInit {
  displayedColumns: string[] = ['srNo', 'departmentname','received', 'pending','approvedless7','approvedless15','approvedless30','approvedgrt30'];
  dataSource : any;
  totalPages: any;
  pageNo = 1;
  pageSize = 10;
  filterForm!:FormGroup;
  pendencyReportArray:any;
  pendencyArray = new Array();
  minDate=new Date();
  reportArray=new Array();
  getUrl:any;
  todayDate=new Date();
  loggedUserTypeId:any;
  loggedUserDeptID:any;
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
    private pdf_excelService : ExcelService,
    private router:Router
  ) {}
  ngOnInit(): void {
    this.getUrl = this.router.url.split('/')[1];
    this.loggedUserTypeId= this.localStrorageData.getLoggedInLocalstorageData().responseData?.userTypeId;
    this.loggedUserDeptID= this.localStrorageData.getLoggedInLocalstorageData().responseData?.deptId;
    this.filterform();
    this.getDepartment();
    this.getPendencyReport();
  }


  filterform() {
    this.filterForm = this.fb.group({
      searchdeptId: ['0'],
      fromDate: [''],
      toDate: ['']
         })
       }


  getDepartment() {
    this.pendencyArray = [];
    this.commonService.getAllDepartment().subscribe({
      next: (response: any) => {
        this.pendencyArray.push(...response);
        if( this.loggedUserTypeId ==3 || this.loggedUserTypeId ==4){       //  2 logged user userTypeId
          this.filterForm.controls['searchdeptId'].setValue(this.loggedUserDeptID);
          this.dropdownDisable=true;
        }    
     },
      error: ((error: any) => { 
         this.error.handelError(error.statusCode) 
      })
    })
  }

  getPendencyReport() {
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
    this.pendencyReportArray=[];
    let obj = formData.searchdeptId + '&userid='+ this.localStrorageData.getUserId() + '&fromDate='+ formData.fromDate + '&toDate='+ formData.toDate
    this.apiService.setHttp('get','api/ShareGrievances/OfficerPendencyReport?searchdeptId=' + obj,false,false,false,'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {

          this.reportArray=res.responseData;
          this.dataSource = new MatTableDataSource(this.reportArray);
          // this.pendencyReportArray = res.responseData.map((ele:any,index:any)=>{
          //   ele.deptId=index +1;
          //   delete ele.isDeleted
          //   return ele});
          // this.dataSource = new MatTableDataSource(res.responseData);

          this.reportArray.map((ele: any, index: any) => {
            let obj={
              'srno':index+1,
              'depertmentName':ele.departmentname,
              'received':ele.received,
              'pending':ele.pending,
              'approvedless7':ele.approvedless7,
              'approvedless15':ele.approvedless15,
              'approvedless30':ele.approvedless30,
              'approvedgrt30':ele.approvedgrt30
            }
              this.pendencyReportArray.push(obj);
           });

          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.dataSource = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
        }
      },
      error: (error: any) => {
        this.error.handelError(error.status);
        this.spinner.hide();
      },
    });
  }

  clearFilter(){
    this.formDirective.resetForm()
    this.pageNo = 1;
    if( this.loggedUserTypeId ==3 || this.loggedUserTypeId ==4){       //  2 logged user userTypeId
      this.filterForm.controls['searchdeptId'].setValue(this.loggedUserDeptID);
      this.dropdownDisable=true;
    }else{
      this.filterForm.controls['searchdeptId'].setValue(0);
    }   
    this.getPendencyReport();
  }

  downloadExcel(){
    // let keyValue = this.pendencyReportArray.map((value: any) => Object.keys(value));
    // let keyData = keyValue[0]; // key Name

    let fromdate:any;
    let todate:any;
    let checkFromDateFlag: boolean = true;
    let checkToDateFlag: boolean = true;
    let formData = this.filterForm.value;
    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';

    let keyPDFHeader = ['Sr.No.', 'Departmentname','received', 'pending','ApprovedLess < 7 days','ApprovedLess 8-15 days','ApprovedLess 16-30 days','ApprovedGrt > 30 days'];
    let ValueData = this.pendencyReportArray.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name
    let objData:any = {
      'topHedingName' : 'Pendency Report',
      'createdDate':'Created on:'+this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a')
    }
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


    let keyPDFHeader = ['SrNo', 'Department Name','Received', 'Pending','ApprovedLess < 7 days','ApprovedLess 8-15 days','ApprovedLess 16-30 days','ApprovedGrt > 30 days'];
    let ValueData = this.pendencyReportArray.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name

    let objData:any = {
      'topHedingName' : 'Pendency Report',
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

  // getDetailsReport(ele:any,eleFlag:any,dateflag:any){
  //   console.log(ele);
  //   let obj={
  //     'url':this.getUrl,
  //     'flag':eleFlag,
  //     'dateFlag':dateflag,
  //     'deptId':ele.deptId
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

  
  getDetailsReport(obj:any,onClickflag:any,pageFlag:any, dateFlag:any){
    this.router.navigate(['samadhan-report', obj.deptId + '.' + onClickflag + '.' + pageFlag + '.'  + dateFlag]); 
  }

}
