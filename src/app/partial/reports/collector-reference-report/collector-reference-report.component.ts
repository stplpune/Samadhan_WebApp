
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/service/api.service';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/core/service/excel_Pdf.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-collector-reference-report',
  templateUrl: './collector-reference-report.component.html',
  styleUrls: ['./collector-reference-report.component.css']
})
export class CollectorReferenceReportComponent implements OnInit {
  filterForm!: FormGroup;
  talukaArray = new Array();
  departmentArray = new Array();
  officeArray = new Array();
  subOfficeArray = new Array();
  reportArray = new Array();
  collectorReferenceReportArray = new Array();
  todayDate = new Date();
  pageNo = 1;
  displayedColumns: string[] = ['srNo', 'departmentName', 'officeName', 'subOfficeName', 'totalReceivedGrievance', 'openGrievance', 'acceptedGrievance', 'resolvedGrievance', 'partialResolved', 'receivedGrievanceFromOtherOffices', 'pendingGrievance'];
  dataSource: any;
  langTypeName!: string;
  totalPages!: number;
  pageSize = 10;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('formDirective') formDirective!: NgForm;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonApiService,
    public error: ErrorHandlerService,
    private webStorage: WebStorageService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private commonMethod: CommonMethodService,
    private datePipe: DatePipe,
    private pdf_excelService: ExcelService,
   private router:Router
  ) { }

  ngOnInit(): void {
    this.filterform();
    this.getDepartment();
    this.getTaluka(1);
    this.getData();
    this.webStorage.langNameOnChange.subscribe(message => {
      this.langTypeName = message;
    });
  }

  filterform() {
    this.filterForm = this.fb.group({
      searchdeptId: ['0'],
      searchofcId: ['0'],
      subofcId: ['0'],
      fromDate: [''],
      toDate: ['']
    });
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

  getDepartment() {
    this.departmentArray = [];
    this.commonService.getAllDepartment().subscribe({
      next: (response: any) => {
        this.departmentArray.push(...response);
      },
      error: (() => {
        this.departmentArray = [];
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
      },
      error: (() => { this.officeArray = []; })
    })
  }

  getSubOffice(officeId: number) {
    if (officeId == 0) {
      return;
    }
    this.subOfficeArray = [];
    this.commonService.getAllSubOfficeByOfficeId(officeId).subscribe({
      next: (response: any) => {
        this.subOfficeArray.push(...response);
      },
      error: (() => { this.subOfficeArray = [] })
    })
  }

  getData() {
    this.spinner.show()
    this.reportArray = [];
    this.collectorReferenceReportArray = [];
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
    this.apiService.setHttp('get', 'samadhan/Reports/CollectorReferenceReport?UserId=' + this.webStorage.getUserId() + '&TextSearch=&TalukaId=0&VillageId=0&DeptId=' + (formData?.searchdeptId || 0) + '&OfficeId=' + (formData?.searchofcId || 0) + '&StatusId=0&fromDate=' + formData?.fromDate + '&toDate=' + formData?.toDate + '&pageno=' + this.pageNo + '&pagesize=0', false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res?.statusCode == '200') {
          this.reportArray = res?.responseData;
          this.dataSource = new MatTableDataSource(this.reportArray);
          this.totalPages = res?.responseData1?.pageCount;
          this.pageNo == 1 ? this.paginator?.firstPage() : '';

          this.reportArray.map((ele: any, index: any) => {
            let obj = {
              'srno': index + 1,
              'depertmentName': ele.departmentName,
              'officeName': ele.officeName,
              'subOfficeName': ele.subOfficeName,
              'received': ele.received,
              'opened': ele.open,
              'accepted': ele.accepted,
              'resolved': ele.resolved,
              'partialResloved': ele.partialResolved,
              'transfered': ele.receivedAndTransferred,
              'pending': ele.pending
            }
            this.collectorReferenceReportArray.push(obj);
          });

          console.log("collectorReferenceReportArray", this.collectorReferenceReportArray);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.dataSource = [];
          this.totalPages = 0;
          if (res.statusCode != 404) {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          }
        }
      },
      error: (error: any) => {
        this.dataSource = [];
        this.error.handelError(error.status);
        this.spinner.hide();
      },
    });
  }

  clearFilter() {
    this.formDirective.resetForm();
    this.filterform();
    this.getData();
    this.officeArray = [];
    this.subOfficeArray = [];
  }

  pageChanged(event: any) {
    this.pageNo = event.pageIndex + 1;
    this.clearFilter();
  }

  downloadExcel() {
    let fromdate: any;
    let todate: any;
    let checkFromDateFlag: boolean = true;
    let checkToDateFlag: boolean = true;
    let formData = this.filterForm.value;
    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';

    let ValueData = this.collectorReferenceReportArray.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name
    let objData: any = {
      'topHedingName': 'Collector Reference Report',
      'createdDate': 'Created on:' + this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a')
    }
    let keyPDFHeader = ['Sr.No.', "Department Name", "Office Name", "Sub Office Name", "Total Grievances", "Open", "Accepted", "Resolved", "Partial Resolved", "Received", "Pending"];

    checkFromDateFlag = formData.fromDate == '' || formData.fromDate == null || formData.fromDate == 0 || formData.fromDate == undefined ? false : true;
    checkToDateFlag = formData.toDate == '' || formData.toDate == null || formData.toDate == 0 || formData.toDate == undefined ? false : true;
    if (formData.fromDate && formData.toDate && checkFromDateFlag && checkToDateFlag) {
      fromdate = new Date(formData.fromDate);
      todate = new Date(formData.toDate);
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

    let keyPDFHeader = ['Sr.No.', "Department Name", "Office Name", "Sub Office Name", "Total Grievances","Open", "Accepted", "Resolved","Partial Resolved","Received","Pending"];
    let ValueData =
      this.collectorReferenceReportArray.reduce(
        (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
        []
      );// Value Name
      let objData:any = {
        'topHedingName': 'Collector Reference Report',
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

    getDetailsReport(obj:any,onClickflag:any,pageFlag:any){
    this.router.navigate(['samadhan-report', obj.concern_DeptId + '.' + onClickflag + '.' + pageFlag + '.' + obj.concern_OfficeId + '.' + obj.concern_SubOfficeId ]); 
  }
} 