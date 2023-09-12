import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/service/api.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { ExcelService } from 'src/app/core/service/excel_Pdf.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { ConfirmationComponent } from 'src/app/partial/dialogs/confirmation/confirmation.component';

@Component({
  selector: 'app-details-report-for-android',
  templateUrl: './details-report-for-android.component.html',
  styleUrls: ['./details-report-for-android.component.css']
})
export class DetailsReportForAndroidComponent implements OnInit {
  data: any = new Array();
  pair: any;
  docId:any;
  url:any;
  urlString:any;
  reportData:any;
  pendingReportArray = new Array();
  constructor(
     private apiService: ApiService,
    public error: ErrorHandlerService,
    // public configService: ConfigService,
    public localStrorageData: WebStorageService,
    private router: Router,
    private pdf_excelService: ExcelService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
  ) {

    var queryparams = this.router.url.split('/')[2];
    var params: any = queryparams.split('&')
    params.forEach((d: any) => {
      this.pair = d.split(':');
      this.data.push({ key: this.pair[0], value: this.pair[1] });
    });
   }

  ngOnInit(): void {
    this.getUrl(this.data[0].value);
    this.docId = this.data[1].value;
  }

  getUrl(id: any) {
    let fromdate!: any;
    let todate!: any;
    let checkFromDateFlag: boolean = true;
    let checkToDateFlag: boolean = true;
    switch(id){
      case '8' :
        let pendingObjData:any = {
          'topHedingName': 'Pending Report',
          'createdDate':'Created on:'+this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a')
        }

        checkFromDateFlag = this.data[8].value == '' || this.data[8].value == null || this.data[8].value == 0 || this.data[8].value == undefined ? false : true;
        checkToDateFlag = this.data[9].value == '' || this.data[9].value == null || this.data[9].value == 0 || this.data[9].value == undefined ? false : true;
        if (this.data[8].value && this.data[9].value && checkFromDateFlag && checkToDateFlag) {
          fromdate = new Date(this.data[8].value);
          todate = new Date(this.data[9].value);
          pendingObjData.timePeriod = 'From Date:' + this.datePipe.transform(fromdate, 'dd/MM/yyyy') + ' To Date: ' + this.datePipe.transform(todate, 'dd/MM/yyyy');
        }
        let pendingHeader = ["Sr.No.","Grievance No.","Name", "Department Name", "Office Name", "Sub Office Name", "Grievance Type","Grievance Details", "Status"];
        this.getOnclickPendingReport(pendingObjData, pendingHeader);
      break;
    }


  }


  getOnclickPendingReport(objData: any, keyPDFHeader: any,) {
    this.pendingReportArray=[];
    let obj = 'searchdeptId=' + this.data[2].value  +'&searchofcId=' + this.data[3].value + '&searchsubofcId=' + this.data[4].value + '&userid=' + this.data[5].value  + '&flag=' + this.data[6].value  + '&DateFlag=' + this.data[7].value +'&fromDate=' + this.data[8].value  +'&toDate='+ this.data[9].value;
    this.apiService.setHttp('get', 'samadhan/OnClickDetailReports/OnClickPendingRPTDetails?' + obj, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.reportData = res.responseData
           this.reportData.map((ele: any, index: any) => {
            let obj = {
              'srno': index + 1,
              'grievance No': ele.grievanceNo,
              'name': ele.userName,
              'departmentName': ele.deptName,
              'OfficeName':ele.officeName,
              'subOfficeName':ele.subOfficeName,
              'grievanceType': ele.grievanceType,
              'grievancedetails': ele.grievanceDescription,
              'status': ele.statusName
            }

            this.pendingReportArray.push(obj);
          })     

        
        this.docId==1? this.downloadPdf(keyPDFHeader, objData, this.pendingReportArray) :this.docId==2? this.downloadExcel(keyPDFHeader, objData, this.pendingReportArray):'';         
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
    this.getConfirmation();
  }

  downloadExcel(keyPDFHeader: any, objData: any, array: any) {
    let ValueData = array.reduce(
      (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)],
      []
    );// Value Name
    this.pdf_excelService.generateExcel(keyPDFHeader, ValueData, objData);
    this.getConfirmation();
  }

  getConfirmation(){
    const dialog = this.dialog.open(ConfirmationComponent, {
      width: '400px',
      data: { p1: 'Your file is getting downloaded !'},
      disableClose: this.apiService.disableCloseFlag,
    })
    dialog.afterClosed().subscribe(_res => {
    })
  }

}
