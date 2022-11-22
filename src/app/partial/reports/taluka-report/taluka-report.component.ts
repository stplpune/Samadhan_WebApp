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
  selector: 'app-taluka-report',
  templateUrl: './taluka-report.component.html',
  styleUrls: ['./taluka-report.component.css']
})
export class TalukaReportComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name','Received', 'Pending','Resolved'];
  dataSource:any;

  filterForm!: FormGroup;
  OfficerTalukaReportArray = new Array();  
  pageNo = 1;
  talukaArray = new Array();


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
    this.getTaluka(1);
    this.filterform();
    this.getOfficerTalukaReport();
  }

  filterform() {
    this.filterForm = this.fb.group({
      TalukaId: [0],
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
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }

  getOfficerTalukaReport() {
    this.spinner.show();
    let formData = this.filterForm.value;
    formData.fromDate = formData.fromDate ? this.datePipe.transform(formData.fromDate, 'yyyy/MM/dd') : '';
    formData.toDate = formData.toDate ? this.datePipe.transform(formData.toDate, 'yyyy/MM/dd') : '';
    let obj = formData.TalukaId + '&userid=' + this.localStrorageData.getUserId() + '&fromDate=' + formData.fromDate + '&toDate=' + formData.toDate
    this.apiService.setHttp('get', 'api/ShareGrievances/OfficerTalukaReport?TalukaId=' + obj, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.OfficerTalukaReportArray = res.responseData.map((ele: any, index: any) => {
            ele.talukaId = index + 1; delete ele.isDeleted;
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

  keyPDFHeader = ['SrNo', "Taluka Name","Received", "Pending", "Resolved"];

  downloadExcel() {
    let ValueData = this.OfficerTalukaReportArray.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name
    let TopHeadingData = 'Office Taluka Report';

    this.pdf_excelService.generateExcel(this.keyPDFHeader, ValueData, TopHeadingData);
  }

  downloadPdf() {
    let ValueData =
      this.OfficerTalukaReportArray.reduce(
        (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
        []
      );// Value Name
    let objData = {
      'topHedingName': 'Office Taluka Report',
      'createdDate':this.datePipe.transform(new Date(), 'dd/MM/yyyy')
    }
    this.pdf_excelService.downLoadPdf(this.keyPDFHeader, ValueData, objData);
  }

  clearFilter() {
    this.filterform();
    this.pageNo = 1;
    this.getOfficerTalukaReport();
  }


}

