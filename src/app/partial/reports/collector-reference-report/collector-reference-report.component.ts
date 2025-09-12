
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
  todayDate = new Date();
  pageNo = 1;
  displayedColumns: string[] = ['srNo', 'departmentName', 'officeName', 'subOfficeName', 'totalReceivedGrievance', 'acceptedGrievance', 'resolvedGrievance', 'receivedGrievanceFromOtherOffices', 'pendingGrievance'];
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
    private commonMethod: CommonMethodService) { }

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
    let formData = this.filterForm.value;
    this.apiService.setHttp('get', 'samadhan/Reports/CollectorReferenceReport?UserId=' + this.webStorage.getUserId() + '&TextSearch=&TalukaId=0&VillageId=0&DeptId=' + (formData?.searchdeptId || 0) + '&OfficeId=' + (formData?.searchofcId || 0) + '&StatusId=0&fromDate=' + formData?.fromDate + '&toDate=' + formData?.toDate + '&pageno=' + this.pageNo + '&pagesize=' + this.pageSize, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res?.statusCode == '200') {
          let dataSet = res?.responseData;
          this.dataSource = new MatTableDataSource(dataSet);
          this.totalPages = res?.responseData1?.pageCount;
          this.pageNo == 1 ? this.paginator?.firstPage() : '';
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
    this.filterform();
    this.getData();
    this.officeArray = [];
  }

  pageChanged(event: any) {
    this.pageNo = event.pageIndex + 1;
    this.clearFilter();
  }
} 