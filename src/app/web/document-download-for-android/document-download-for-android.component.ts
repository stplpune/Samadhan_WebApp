
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/configs/config.service';
import { ApiService } from 'src/app/core/service/api.service';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { ExcelService } from 'src/app/core/service/excel_Pdf.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';

@Component({
  selector: 'app-document-download-for-android',
  templateUrl: './document-download-for-android.component.html',
  styleUrls: ['./document-download-for-android.component.css']
})
export class DocumentDownloadForAndroidComponent implements OnInit {
  data: any = new Array();
  pair: any;
  docId:any;
  officeDepReportArray: any;
  officeOffReportArray: any;
  OfficerTalukaReportArray: any;
  pendencyReportArray: any;
  officeIsSatisfiedReportArray: any;

  constructor(
    private apiService: ApiService,
    public error: ErrorHandlerService,
    public configService: ConfigService,
    public validation: FormsValidationService,
    public localStrorageData: WebStorageService,
    public commonService: CommonApiService,
    public dialog: MatDialog,
    public commonMethod: CommonMethodService,
    private router: Router,
    private pdf_excelService: ExcelService,
    private datePipe: DatePipe,
  ) {
    var queryparams = this.router.url.split('/')[2];
    var params: any = queryparams.split('&')
    params.forEach((d: any) => {
      this.pair = d.split(':');
      this.data.push({ key: this.pair[0], value: this.pair[1] });
    });
  }
  ngOnInit(): void {
    // this.getOfficerDepartmentReport();
    this.getUrl(this.data[0].value);
    console.log(this.data);
    this.docId=this.data[1].value
  }

  getUrl(id: any) {
    let fromdate!: any;
    let todate!: any;
    let checkFromDateFlag: boolean = true;
    let checkToDateFlag: boolean = true;
    switch (id) {
      case '1':
        let deptHeader = ["SrNo", "Department Name", "Received", "Pending", "Resolved"];
        let deptObjData: any = {
          'topHedingName': 'Department Report',
          'createdDate': 'Created on : ' + this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a')
        }

        checkFromDateFlag = this.data[4].value == '' || this.data[4].value == null || this.data[4].value == 0 || this.data[4].value == undefined ? false : true;
        checkToDateFlag = this.data[5].value == '' || this.data[5].value == null || this.data[5].value == 0 || this.data[5].value == undefined ? false : true;
        if (this.data[4].value && this.data[5].value && checkFromDateFlag && checkToDateFlag) {
          fromdate = new Date(this.data[4].value);
          todate = new Date(this.data[5].value);
          deptObjData.timePeriod = 'From Date:' + this.datePipe.transform(fromdate, 'dd/MM/yyyy') + ' To Date: ' + this.datePipe.transform(todate, 'dd/MM/yyyy');
        }
        this.getOfficerDepartmentReport(deptHeader, deptObjData);
        break;

      case '2':
        let offHeader = ["SrNo", "Department Name", "Office Name", "Received", "Pending", "Resolved"];
        let offObjData:any = {
          'topHedingName': 'Office Report',
          'createdDate':'Created on : ' + this.datePipe.transform(new Date(),  'dd/MM/yyyy hh:mm a')
        }
        checkFromDateFlag = this.data[5].value == '' || this.data[5].value == null || this.data[5].value == 0 || this.data[5].value == undefined ? false : true;
        checkToDateFlag = this.data[6].value == '' || this.data[6].value == null || this.data[6].value == 0 || this.data[6].value == undefined ? false : true;
        if (this.data[5].value && this.data[6].value && checkFromDateFlag && checkToDateFlag) {
          fromdate = new Date(this.data[5].value);
          todate = new Date(this.data[6].value);
          offObjData.timePeriod = 'From Date:' + this.datePipe.transform(fromdate, 'dd/MM/yyyy') + ' To Date: ' + this.datePipe.transform(todate, 'dd/MM/yyyy');
        }
        this.getOfficerOfficeReport(offHeader, offObjData);
        break;

      case '3':
        let talHeader = ['SrNo', "Taluka Name", "Received", "Pending", "Resolved"];
        let talObjData:any = {
          'topHedingName': 'Taluka Report',
          'createdDate':'Created on : ' + this.datePipe.transform(new Date(),  'dd/MM/yyyy hh:mm a')
        }

        checkFromDateFlag = this.data[4].value == '' || this.data[4].value == null || this.data[4].value == 0 || this.data[4].value == undefined ? false : true;
        checkToDateFlag = this.data[5].value == '' || this.data[5].value == null || this.data[5].value == 0 || this.data[5].value == undefined ? false : true;
        if (this.data[4].value && this.data[5].value && checkFromDateFlag && checkToDateFlag) {
          fromdate = new Date(this.data[4].value);
          todate = new Date(this.data[5].value);
          talObjData.timePeriod = 'From Date:' + this.datePipe.transform(fromdate, 'dd/MM/yyyy') + ' To Date: ' + this.datePipe.transform(todate, 'dd/MM/yyyy');
        }
        this.getOfficerTalukaReport(talHeader, talObjData);
        break;

      case '4':
        let penHeader = ['SrNo', 'Department Name', 'Received', 'Pending', 'Approvedless7', 'Approvedless15', 'Approvedless30', 'Approvedgrt30'];
        let penObjData:any = {
          'topHedingName': 'Pendency Report',
          'createdDate': 'Created on : ' + this.datePipe.transform(new Date(),  'dd/MM/yyyy hh:mm a')
        }

        checkFromDateFlag = this.data[4].value == '' || this.data[4].value == null || this.data[4].value == 0 || this.data[4].value == undefined ? false : true;
        checkToDateFlag = this.data[5].value == '' || this.data[5].value == null || this.data[5].value == 0 || this.data[5].value == undefined ? false : true;
        if (this.data[4].value && this.data[5].value && checkFromDateFlag && checkToDateFlag) {
          fromdate = new Date(this.data[4].value);
          todate = new Date(this.data[5].value);
          penObjData.timePeriod = 'From Date:' + this.datePipe.transform(fromdate, 'dd/MM/yyyy') + ' To Date: ' + this.datePipe.transform(todate, 'dd/MM/yyyy');
        }
        this.getPendencyReport(penHeader, penObjData);
        break;


      case '5':
        let sastisfiedHeader = ['SrNo', "Department Name", "Received", "satisfied", "unSatisfied"];
        let sastisfiedObjData:any = {
          'topHedingName': 'Satisfied Report',
          'createdDate':'Created on : ' + this.datePipe.transform(new Date(),  'dd/MM/yyyy hh:mm a')
        }
        checkFromDateFlag = this.data[4].value == '' || this.data[4].value == null || this.data[4].value == 0 || this.data[4].value == undefined ? false : true;
        checkToDateFlag = this.data[5].value == '' || this.data[5].value == null || this.data[5].value == 0 || this.data[5].value == undefined ? false : true;
        if (this.data[4].value && this.data[5].value && checkFromDateFlag && checkToDateFlag) {
          fromdate = new Date(this.data[4].value);
          todate = new Date(this.data[5].value);
          sastisfiedObjData.timePeriod = 'From Date:' + this.datePipe.transform(fromdate, 'dd/MM/yyyy') + ' To Date: ' + this.datePipe.transform(todate, 'dd/MM/yyyy');
        }
        this.getOfficerIsSatisfiedReport(sastisfiedHeader, sastisfiedObjData);
        break;
    }

  }

  getOfficerDepartmentReport(keyPDFHeader: any, objData: any) {
    let obj = this.data[2].value + '&userid=' + this.data[3].value + '&fromDate=' + this.data[4].value + '&toDate=' + this.data[5].value
    this.apiService.setHttp('get', 'api/ShareGrievances/OfficerDepartmentReport?searchdeptId=' + obj, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.officeDepReportArray = res.responseData.map((ele: any, index: any) => {
            ele.deptId = index + 1;
            delete ele.isDeleted
            return ele
          });

        this.docId==1? this.downloadPdf(keyPDFHeader, objData, this.officeDepReportArray) :this.docId==2? this.downloadExcel(keyPDFHeader, objData, this.officeDepReportArray):'';         
        } else {
        }
      },
      error: (error: any) => {
        this.error.handelError(error.status);
      },
    });
  }


  getOfficerOfficeReport(keyPDFHeader: any, objData: any) {
    let obj = this.data[2].value + '&searchofcId' + this.data[3].value + '&userid=' + this.data[4].value + '&fromDate=' + this.data[5].value + '&toDate=' + this.data[6].value
    this.apiService.setHttp('get', 'api/ShareGrievances/OfficerOfficeReport?searchdeptId=' + obj, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.officeOffReportArray = res.responseData.map((ele: any, index: any) => {
            ele.deptId = index + 1; delete ele.isDeleted; delete ele.officeId
            return ele
          });
          this.docId==1? this.downloadPdf(keyPDFHeader, objData, this.officeOffReportArray) :this.docId==2? this.downloadExcel(keyPDFHeader, objData, this.officeOffReportArray):'';         
        } else {
        }
      },
      error: (error: any) => {
        this.error.handelError(error.status);
      },
    });
  }


  getOfficerTalukaReport(keyPDFHeader: any, objData: any) {
    let obj = this.data[2].value + '&userid=' + this.data[3].value + '&fromDate=' + this.data[4].value + '&toDate=' + this.data[5].value
    this.apiService.setHttp('get', 'api/ShareGrievances/OfficerTalukaReport?TalukaId=' + obj, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.OfficerTalukaReportArray = res.responseData.map((ele: any, index: any) => {
            ele.talukaId = index + 1; delete ele.isDeleted;
            return ele
          });
          this.docId==1? this.downloadPdf(keyPDFHeader, objData, this.OfficerTalukaReportArray) :this.docId==2? this.downloadExcel(keyPDFHeader, objData, this.OfficerTalukaReportArray):'';                

        } else {
        }
      },
      error: (error: any) => {
        this.error.handelError(error.status);

      },
    });
  }

  getPendencyReport(keyPDFHeader: any, objData: any) {
    let obj = this.data[2].value + '&userid=' + this.data[3].value + '&fromDate=' + this.data[4].value + '&toDate=' + this.data[5].value
    this.apiService.setHttp('get', 'api/ShareGrievances/OfficerPendencyReport?searchdeptId=' + obj, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.pendencyReportArray = res.responseData.map((ele: any, index: any) => {
            ele.deptId = index + 1;
            delete ele.isDeleted
            return ele
          });
          this.docId==1? this.downloadPdf(keyPDFHeader, objData, this.pendencyReportArray) :this.docId==2? this.downloadExcel(keyPDFHeader, objData, this.pendencyReportArray):'';         
        } else {
        }
      },
      error: (error: any) => {
        this.error.handelError(error.status);
      },
    });
  }

  getOfficerIsSatisfiedReport(keyPDFHeader: any, objData: any) {
    let obj = this.data[2].value + '&userid=' + this.data[3].value + '&fromDate=' + this.data[4].value + '&toDate=' + this.data[5].value
    this.apiService.setHttp('get', 'api/ShareGrievances/OfficerIsSatisfiedReport?searchdeptId=' + obj, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.officeIsSatisfiedReportArray = res.responseData.map((ele: any, index: any) => {
            ele.deptId = index + 1; delete ele.isDeleted;
            return ele
          });
          this.docId==1? this.downloadPdf(keyPDFHeader, objData, this.officeIsSatisfiedReportArray) :this.docId==2? this.downloadExcel(keyPDFHeader, objData, this.officeIsSatisfiedReportArray):'';         
        } else {
        }
      },
      error: (error: any) => {
        this.error.handelError(error.status);
      },
    });
  }

  downloadPdf(keyPDFHeader: any, objData: any, array: any) {
    let ValueData = array.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name
    this.pdf_excelService.downLoadPdf(keyPDFHeader, ValueData, objData);
  }

  downloadExcel(keyPDFHeader: any, objData: any, array: any) {
    let ValueData = array.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name
    this.pdf_excelService.generateExcel(keyPDFHeader, ValueData, objData);
  }
}


