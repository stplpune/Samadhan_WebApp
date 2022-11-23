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
  selector: 'app-satisfied-report',
  templateUrl: './satisfied-report.component.html',
  styleUrls: ['./satisfied-report.component.css']
})
export class SatisfiedReportComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name','Received','Resolved','satisfied','unSatisfied'];
  filterForm!:FormGroup;
  dataSource:any;
  totalPages: any;
  pageNo = 1;
  pageSize = 10;
  officeIsSatisfiedReportArray=new Array();
  departmentArray=new Array();

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
  ){

  }
  ngOnInit(): void {
    this.filterform();
    this.getDepartment();
    this.getOfficerIsSatisfiedReport();
  }

  filterform() {
    this.filterForm = this.fb.group({
      searchdeptId: [0],
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

  getOfficerIsSatisfiedReport() {
    this.spinner.show();
    let formData = this.filterForm.value;
    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';
    let obj = formData.searchdeptId + '&userid=' + this.localStrorageData.getUserId() + '&fromDate=' + formData.fromDate + '&toDate=' + formData.toDate
    this.apiService.setHttp('get', 'api/ShareGrievances/OfficerIsSatisfiedReport?searchdeptId=' + obj, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.officeIsSatisfiedReportArray = res.responseData.map((ele: any, index: any) => {
            ele.deptId = index + 1; delete ele.isDeleted; 
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

  downloadExcel() {
    let ValueData = this.officeIsSatisfiedReportArray.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name
    let objData = {
      'topHedingName' : 'Pendency Report',
      'createdDate':this.datePipe.transform(new Date(), 'dd/MM/yyyy')
    }
    let keyPDFHeader = ['SrNo', "Department Name", "Office Name", "Received", "Pending", "Resolved"];
    this.pdf_excelService.generateExcel(keyPDFHeader, ValueData, objData);
  }

  downloadPdf() {
    let keyPDFHeader = ['SrNo', "Department Name", "Received", "Resolved","satisfied","unSatisfied"];
    let ValueData =
      this.officeIsSatisfiedReportArray.reduce(
        (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
        []
      );// Value Name
      let objData = {
        'topHedingName' : 'Pendency Report',
        'createdDate':this.datePipe.transform(new Date(), 'dd/MM/yyyy')
      }
    this.pdf_excelService.downLoadPdf(keyPDFHeader, ValueData, objData);
  }

  clearFilter() {
    this.filterform();
    this.pageNo = 1;
    this.getOfficerIsSatisfiedReport();
  }

}
