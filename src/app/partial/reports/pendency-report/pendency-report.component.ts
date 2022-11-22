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
    this.getDepartment();
    this.getPendencyReport();
  }


  filterform() {
    this.filterForm = this.fb.group({
      searchdeptId: [0],
      fromDate: [''],
      toDate: ['']
         })
       }


  getDepartment() {
    this.pendencyArray = [];
    this.commonService.getAllDepartment().subscribe({
      next: (response: any) => {
        this.pendencyArray.push(...response);
     },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }

  getPendencyReport() {
    this.spinner.show();
    let formData = this.filterForm.value;
    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';
    let obj = formData.searchdeptId + '&userid='+ this.localStrorageData.getUserId() + '&fromDate='+ formData.fromDate + '&toDate='+ formData.toDate
    this.apiService.setHttp('get','api/ShareGrievances/OfficerPendencyReport?searchdeptId=' + obj,false,false,false,'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this. pendencyReportArray = res.responseData.map((ele:any,index:any)=>{
            ele.deptId=index+1;
            delete ele.isDeleted
            return ele});
          this.dataSource = new MatTableDataSource(res.responseData);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.dataSource = [];
        }
      },
      error: (error: any) => {
        this.error.handelError(error.status);
        this.spinner.hide();
      },
    });
  }

  clearFilter(){
    this.filterform();
    this.getPendencyReport();
  }

  downloadExcel(){

    let ValueData = this.pendencyReportArray.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name
    let TopHeadingData = 'Pendency Report';
    let keyPDFHeader = ["SrNo","Department Name", "Received","Pending","Approvedless7","Approvedless15","Approvedless30","Approvedgrt30"];
    this.pdf_excelService.generateExcel(keyPDFHeader, ValueData, TopHeadingData);
  }

  downloadPdf() {
    let keyPDFHeader = ['SrNo', 'Department Name','Received', 'Pending','Approvedless7','Approvedless15','Approvedless30','Approvedgrt30'];
    let ValueData = this.pendencyReportArray.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name

    let objData = {
      'topHedingName' : 'Pendency Report',
    }
    this.pdf_excelService.downLoadPdf(keyPDFHeader, ValueData, objData);
  }

}
