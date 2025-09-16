import { DatePipe } from '@angular/common';
import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
// import { MatTableDataSource } from '@angular/material/table';
// import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigService } from 'src/app/configs/config.service';
import { ApiService } from 'src/app/core/service/api.service';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { ExcelService } from 'src/app/core/service/excel_Pdf.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { GrievanceDetailsComponent } from 'src/app/web/grievance-details/grievance-details.component';

@Component({
  selector: 'app-samadhan-report',
  templateUrl: './samadhan-report.component.html',
  styleUrls: ['./samadhan-report.component.css']
})
export class SamadhanReportComponent implements OnInit {
  displayedColumns = new Array();
  filterForm!: FormGroup;
  dataSource: any;
  totalPages!: number;
  url: any;
  userId: any;
  urlString: any;
  columns = [{ header: "Sr.No.", column: 'index', flag: true }, { header: "Grievance No.", column: 'grievanceNo', flag: true }, { header: "Name", column: 'userName', flag: true }, { header: "Department Name", column: 'deptName', flag: true },{ header: "Office Name", column: 'officeName', flag: true },
  { header: "Grievance Type", column: 'grievanceType', flag: true }, { header: "Grievance Details", column: 'grievanceDescription', flag: true }, { header: "Status", column: 'statusName', flag: true }];
  reportData = new Array();
  header = new Array();
  departmentArray = new Array();
  reportArray = new Array();
  pageNo = 1;
  objData: any;
  redirectGetData: any;
  heading = new Array();
  todayDate = new Date();
  data: any;

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
    private route: ActivatedRoute,
    // private router:Router,
    @Optional() public dialogRef: MatDialogRef<SamadhanReportComponent>,
    // @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userId = this.localStrorageData.getUserId();

    let getUrlData: any = this.route.snapshot.params?.['id'];
    if (getUrlData) {
      getUrlData = getUrlData.split('.');
      this.redirectGetData = { 'deptId': +getUrlData[0], 'onClickflag': +getUrlData[1], 'pageFlag': +getUrlData[2], 'offId': +getUrlData[3],'subOfficeId': + getUrlData[4],'subOfficeFlag': + getUrlData[5] }

    }

  }

  satifiedAndUnsatifiedFlag:any;
  ngOnInit(): void {
    console.log('this.redirectGetData',this.redirectGetData)
    let dateData: any = localStorage.getItem('dateRange');
    this.data = JSON.parse(dateData);
    this.data ? this.filterform(this.data) : this.filterform()
   this.satifiedAndUnsatifiedFlag = localStorage.getItem('appliedColor');
    // this.getdepartment(this.userId);
    // if(this.data){
    //   this.filterForm.controls['fromDate'].setValue(new Date(this.data.fromDate));
    //   this.filterForm.controls['toDate'].setValue(new Date(this.data.toDate));
    // }
    this.getUrl();


  }

  filterform(data?: any) {
    this.filterForm = this.fb.group({
      // searchdeptId: [0],
      fromDate: [data ? new Date(data?.fromDate) : ''],
      toDate: [data ? new Date(data?.toDate) : '']
    })
  }

  // getdepartment(id: any) {
  //   this.departmentArray = [];
  //   this.commonService.getAllDepartmentByUserId(id).subscribe({
  //     next: (response: any) => {
  //       this.departmentArray.push(...response);
  //     },
  //     error: ((error: any) => { this.error.handelError(error.statusCode) })
  //   })
  // }

  getUrl() {

    switch (this.redirectGetData.pageFlag) {
      case 1:
        this.url = 'samadhan/OnClickDetailReports/OnClickDepartmentRPTDetails?'
        this.urlString = 'flag=' + this.redirectGetData.onClickflag + '&searchdeptId=' + this.redirectGetData.deptId;
        this.heading = ["Department", "Report"];
        this.getReport();
        break;

      case 2:
        this.url = 'samadhan/OnClickDetailReports/OnClickOfficeRPTDetails?'
        this.urlString = 'flag=' + this.redirectGetData.onClickflag + '&searchdeptId=' + this.redirectGetData.deptId + '&searchofcId=' + this.redirectGetData.offId;
        this.heading = ["Office", "Report"]
        this.getReport();
        break;

      case 3:
        this.url = 'samadhan/OnClickDetailReports/OnClickTalukaRPTDetails?'
        this.urlString = 'flag=' + this.redirectGetData.onClickflag + '&searchtalukaId=' + this.redirectGetData.deptId; // this.redirectGetData.deptId is talukaId
        this.heading = ["Taluka", "Report"]
        this.getReport();
        break;

      case 4:
        this.url = 'samadhan/OnClickDetailReports/OnClicIsSatisfiedkRPTDetails?'
        this.urlString = 'flag=' + this.redirectGetData.onClickflag + '&searchdeptId=' + this.redirectGetData.deptId;
        this.heading = ["Satisfied", "Report"]

        if(this.redirectGetData.onClickflag == 3 || this.redirectGetData.onClickflag == 4){
          this.columns.push({ header: "Feedback Status", column: 'feedbackstatus', flag: true },{header: "Feedback Remark", column: 'feedbackRemark', flag: true})
        }
       
        this.getReport();
        break;

      case 5:
        this.url = 'samadhan/OnClickDetailReports/OnClicPendancykRPTDetails?'
        this.urlString = 'searchdeptId=' + this.redirectGetData.deptId + '&flag=' + this.redirectGetData.offId + '&DateFlag=' + this.redirectGetData.onClickflag; //value of flag in offid ,value of date flag in onClickFlag of redirectGetData object
        this.heading = ["Pendancy", "Report"]
        this.getReport();
        break;

       case 6:
        this.url = 'samadhan/OnClickDetailReports/OnClickSubOfficeRPTDetails?'
        this.urlString = 'flag=' +this.redirectGetData.onClickflag + '&searchdeptId=' + this.redirectGetData.deptId+ '&searchofcId=' + this.redirectGetData.offId + '&searchsubofcId=' +this.redirectGetData.subOfficeId; //value of flag in offid ,value of date flag in onClickFlag of redirectGetData object
        this.heading = ["Sub Office", "Report"];
        // this.columns.push({ header: "Sub Office Name", column: 'subOfficeName', flag: true });
        this.getReport();
        break;

        case 7:
          this.url = 'samadhan/OnClickDetailReports/OnClickPendingRPTDetails?'
          this.urlString =  'searchdeptId=' + this.redirectGetData.deptId +'&searchofcId=' + this.redirectGetData.subOfficeId + '&searchsubofcId=' +this.redirectGetData.subOfficeFlag + '&flag=' +this.redirectGetData.offId + '&DateFlag=' + this.redirectGetData.onClickflag; //value of flag in offid ,value of date flag in onClickFlag of redirectGetData object
          this.heading = ["Pending", "Report"];
        this.getReport();
         break;

         case 8:
          this.url = 'samadhan/OnClickDetailReports/OnClickCollectorReferenceRPTDetails?'
          this.urlString = 'flag=' +this.redirectGetData.onClickflag + '&searchdeptId=' + this.redirectGetData.deptId +'&searchofcId=' + this.redirectGetData.offId + '&searchsubofcId=' +this.redirectGetData.subOfficeId  
          this.heading = ["Collector Reference", "Report"];
        this.getReport();
    }
  }

  getReport() {
    this.spinner.show();
    let formData = this.filterForm.value;

    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';

    if (formData.fromDate) {
      if (!formData.toDate) {
        this.commonMethod.matSnackBar('Please select end date', 1);
        this.spinner.hide();
        return
      }
    }

    this.reportArray = [];
    this.apiService.setHttp('get', this.url + this.urlString + '&userid=' + this.userId + '&fromDate=' + formData.fromDate + '&toDate=' + formData.toDate, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {

          // this.dataSource = new MatTableDataSource(res.responseData);
          this.reportData = res.responseData
          this.dataSource = this.reportData;
          this.reportData.map((ele: any, index: any) => {
            let obj = {
              'srno': index + 1,
              'grievance No': ele.grievanceNo,
              'name': ele.userName,
              'departmentName': ele.deptName,
              'OfficeName':ele.officeName,
              'grievanceType': ele.grievanceType,
              'grievancedetails': ele.grievanceDescription,
              'status': ele.statusName
            }       
            
          //   this.columns.find((head:any)=>{
          //     if(head.header=='Sub Office Name'){
          //       obj['subOfficeName']=ele.subOfficeName;
                
          //     }             
          // })
            
            this.columns.find((head:any)=>{
              if(head.header=='Feedback Status' || head.header=='Feedback Remark'){
                obj['feedbackStatus']=ele.feedbackstatus;
                obj['feedbackRemark']=ele.feedbackRemark;
              }             
          })
         
            this.reportArray.push(obj);
          });

        
          this.totalPages = res.responseData1.pageCount;
          this.selecteColumn();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.dataSource = [];
          this.reportData = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          this.totalPages = 0;
        }
      },
      error: (error: any) => {
        this.error.handelError(error.status);
        this.spinner.hide();
      },
    });
  }

  selecteColumn() {
    this.displayedColumns = [];
    this.header = [];
    this.columns.map((x: any) => {
      this.displayedColumns.push(x.column);
      this.header.push(x.header);
    })
  }

  downloadPdf() {
    // let heading = this.data.url.split('-');
    let fromdate: any;
    let todate: any;
    let checkFromDateFlag: boolean = true;
    let checkToDateFlag: boolean = true;
    let formData = this.filterForm.value;
    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';

    let keyPDFHeader = new Array();
    this.columns.map((ele: any) => {
      keyPDFHeader.push(ele.header);
    })


    let ValueData = this.reportArray.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );


    this.objData = {
      'topHedingName': this.heading[0] + ' ' + this.heading[1],
      'createdDate': 'Created on:' + this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a')
    }

    checkFromDateFlag = formData.fromDate == '' || formData.fromDate == null || formData.fromDate == 0 || formData.fromDate == undefined ? false : true;
    checkToDateFlag = formData.toDate == '' || formData.toDate == null || formData.toDate == 0 || formData.toDate == undefined ? false : true;
    if (formData.fromDate && formData.toDate && checkFromDateFlag && checkToDateFlag) {
      fromdate = new Date(formData.fromDate);
      todate = new Date(formData.toDate);
      this.objData.timePeriod = 'From Date:' + this.datePipe.transform(fromdate, 'dd/MM/yyyy') + ' To Date: ' + this.datePipe.transform(todate, 'dd/MM/yyyy');
    }
    this.pdf_excelService.downLoadPdf(keyPDFHeader, ValueData, this.objData);
  }

  downloadExcel() {
    // let heading = this.data.url.split('-');
    let fromdate: any;
    let todate: any;
    let checkFromDateFlag: boolean = true;
    let checkToDateFlag: boolean = true;
    let formData = this.filterForm.value;
    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';

    let ValueData = this.reportArray.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );
    let keyPDFHeader = new Array();
    this.columns.map((ele: any) => {
      keyPDFHeader.push(ele.header);
    })

    this.objData = {
      'topHedingName': this.heading[0] + ' ' + this.heading[1],
      'createdDate': 'Created on:' + this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a')
    }

    checkFromDateFlag = formData.fromDate == '' || formData.fromDate == null || formData.fromDate == 0 || formData.fromDate == undefined ? false : true;
    checkToDateFlag = formData.toDate == '' || formData.toDate == null || formData.toDate == 0 || formData.toDate == undefined ? false : true;
    if (formData.fromDate && formData.toDate && checkFromDateFlag && checkToDateFlag) {
      fromdate = new Date(formData.fromDate);
      todate = new Date(formData.toDate);
      this.objData.timePeriod = 'From Date:' + this.datePipe.transform(fromdate, 'dd/MM/yyyy') + ' To Date: ' + this.datePipe.transform(todate, 'dd/MM/yyyy');
    }

    this.pdf_excelService.generateExcel(keyPDFHeader, ValueData, this.objData);
  }

  clearFilter() {
    this.filterform();
    this.getReport();

  }
  ngOnDestroy(): void {
    localStorage.removeItem("dateRange");
    localStorage.removeItem('appliedColor');
  }

  grievanceDetails(grievanceId: any) {
    const dialogRef = this.dialog.open(GrievanceDetailsComponent, {
      width: '100%',
      data: {
        id: grievanceId
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((_result: any) => {
      
    });
  }


}


