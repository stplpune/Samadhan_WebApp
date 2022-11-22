import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigService } from 'src/app/configs/config.service';
import { ApiService } from 'src/app/core/service/api.service';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { ExcelService } from 'src/app/core/service/excel_Pdf.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';

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
  displayedColumns: string[] = ['position', 'name', 'OfficeName', 'Received', 'Pending', 'Resolved'];
  minDate = new Date()
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
  ) { }

  ngOnInit(): void {
    this.filterform();
    this.getDepartment();
    this.getOfficerOfficeReport();
  }

  filterform() {
    this.filterForm = this.fb.group({
      searchdeptId: [0],
      searchofcId: [0],
      fromDate: [''],
      toDate: ['']
    })
  }


  getDepartment() {
    this.departmentArray = [];
    this.commonService.getAllDepartment().subscribe({
      next: (response: any) => {
        this.departmentArray.push(...response);
      },
      error: ((error: any) => { this.error.handelError(error.status) })
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
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }


  getOfficerOfficeReport() {
    this.spinner.show();
    let formData = this.filterForm.value;
    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';
    let obj = formData.searchdeptId + '&userid=' + this.localStrorageData.getUserId() + '&fromDate=' + formData.fromDate + '&toDate=' + formData.toDate
    this.apiService.setHttp('get', 'api/ShareGrievances/OfficerOfficeReport?searchdeptId=' + obj, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.officeOffReportArray = res.responseData.map((ele: any, index: any) => {
            ele.deptId = index + 1; delete ele.isDeleted; delete ele.officeId
            return ele
          });
          this.dataSource = new MatTableDataSource(res.responseData);
          // this.totalPages = res.responseData1.pageCount;
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.dataSource = [];
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
    this.filterform();
    this.pageNo = 1;
    this.getOfficerOfficeReport();
  }

  downloadExcel() {
    let ValueData = this.officeOffReportArray.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name
    let TopHeadingData = 'Office Report';
    let keyPDFHeader = ['SrNo', "Department Name", "Office Name", "Received", "Pending", "Resolved"];
    this.pdf_excelService.generateExcel(keyPDFHeader, ValueData, TopHeadingData);
  }

  downloadPdf() {
    let keyPDFHeader = ['SrNo', "Department Name", "Office Name", "Received", "Pending", "Resolved"];
    let ValueData =
      this.officeOffReportArray.reduce(
        (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
        []
      );// Value Name
    let objData = {
      'topHedingName': 'Office Report',
    }
    this.pdf_excelService.downLoadPdf(keyPDFHeader, ValueData, objData);
  }

}





