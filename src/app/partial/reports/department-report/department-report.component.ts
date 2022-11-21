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
  selector: 'app-department-report',
  templateUrl: './department-report.component.html',
  styleUrls: ['./department-report.component.css']
})
export class DepartmentReportComponent implements OnInit {

  filterForm!:FormGroup;
  displayedColumns: string[] = ['srNo', 'departmentname', 'received', 'pending','resolved'];
  dataSource:any;
  totalPages: any;
  pageNo = 1;
  pageSize = 10;
  officeDepReportArray:any;
  departmentArray = new Array();
  
  
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
  ) {}

  ngOnInit(): void {
    this.filterform();
    this.getOfficerDepartmentReport();
    this.getDepartment();
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

  getOfficerDepartmentReport() {
    this.spinner.show();
    let formData = this.filterForm.value;
    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';
    let obj = formData.searchdeptId + '&pageno='+ this.pageNo + '&pagesize='+ this.pageSize + '&userid='+ 2 + '&fromDate='+ formData.fromDate + '&toDate='+ formData.toDate
    this.apiService.setHttp('get','samadhan/Reports/OfficerDepartmentReport?searchdeptId=' + obj,false,false,false,'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.officeDepReportArray = res.responseData.map((ele:any)=>{ 
            delete ele.isDeleted 
            return ele});
          this.dataSource = new MatTableDataSource(res.responseData);
          this.totalPages = res.responseData1.pageCount;
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.dataSource = [];
          this.totalPages = 0;
        }
      },
      error: (error: any) => {
        this.error.handelError(error.status);
        this.spinner.hide();
      },
    });
  }

  pageChanged(event: any) {
    this.pageNo = event.pageIndex + 1;
    this.getOfficerDepartmentReport();
  }

  clearFilter(){
    this.filterform();
    this.pageNo = 1;
    this.getOfficerDepartmentReport();
  }

  downloadExcel(){
    let keyValue = this.officeDepReportArray.map((value: any) => Object.keys(value));
    let keyData = keyValue[0]; // key Name

    let ValueData = this.officeDepReportArray.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name
    let TopHeadingData = 'Department Report';
    this.pdf_excelService.generateExcel(keyData, ValueData, TopHeadingData);
  }

  downloadPdf() {
    let keyPDFHeader = ["Department Id","Department Name", "Received","Pending","Resolved"]; 
    let ValueData = this.officeDepReportArray.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name

    let objData = {
      'topHedingName' : 'Department Report',
    }
    this.pdf_excelService.downLoadPdf(keyPDFHeader, ValueData, objData);
  }


}
