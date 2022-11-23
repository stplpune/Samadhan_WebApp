
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
  data:any=new Array();
  pair :any;
  officeDepReportArray: any;
  constructor(
    private apiService: ApiService,
    public error: ErrorHandlerService,
    public configService: ConfigService,
    public validation: FormsValidationService,
    public localStrorageData: WebStorageService,
    public commonService: CommonApiService,
    public dialog: MatDialog,
    public commonMethod: CommonMethodService,
    private router:Router,
    private pdf_excelService : ExcelService,
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
    this.getOfficerDepartmentReport();
  }


getOfficerDepartmentReport() {
  let obj = this.data[0].value + '&userid='+ this.data[1].value+ '&fromDate='+ this.data[2].value + '&toDate='+ this.data[3].value
  this.apiService.setHttp('get','api/ShareGrievances/OfficerDepartmentReport?searchdeptId=' + obj,false,false,false,'samadhanMiningService');
  this.apiService.getHttp().subscribe({
    next: (res: any) => {
      if (res.statusCode == 200) {
        this.officeDepReportArray = res.responseData.map((ele:any,index:any)=>{ 
          ele.deptId=index+1;
          delete ele.isDeleted 
          return ele});

          this.downloadPdf();
      } else {
      }
    },
    error: (error: any) => {
      this.error.handelError(error.status);
    },
  });
}

downloadPdf() {
  let keyPDFHeader = ["SrNo","Department Name", "Received","Pending","Resolved"]; 
  let ValueData = this.officeDepReportArray.reduce(
    (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
    []
  );// Value Name
  
  let objData = {
    'topHedingName' : 'Department Report',
    'createdDate':this.datePipe.transform(new Date(), 'dd/MM/yyyy')
  }
  this.pdf_excelService.downLoadPdf(keyPDFHeader, ValueData, objData);
}


}
