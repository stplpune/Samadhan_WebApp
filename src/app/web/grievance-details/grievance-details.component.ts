import { Component, OnInit,Inject, Optional } from '@angular/core';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { ApiService } from 'src/app/core/service/api.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from 'src/app/configs/config.service';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-grievance-details',
  templateUrl: './grievance-details.component.html',
  styleUrls: ['./grievance-details.component.css']
})
export class GrievanceDetailsComponent implements OnInit {

  grivanceData: any;
  dataSource:any;
  OfficerImagesData:any;
  displayedColumns=['srNo','departmentName','officeName','status', 'remark','action']
  constructor(public commonMethod: CommonMethodService,
    public apiService: ApiService,
    public error: ErrorHandlerService,
    public dialog: MatDialog,
    public configService: ConfigService,
    public commonService: CommonApiService,
    private route: ActivatedRoute,
    public localStrorageData: WebStorageService,
    @Optional() public dialogRef: MatDialogRef<GrievanceDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.data? this.getGrievance_App(this.data.id): this.getGrievance_App(this.route.snapshot.params['id']);
     
   
  }

  getGrievance_App(grievanceId: any) {
    this.apiService.setHttp('get', "samdhan/Grievance_App/GetById?Id=" + grievanceId, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.grivanceData = res.responseData;
          this.OfficerImagesData=res.responseData.officerRedressalImages;
          console.log(this.OfficerImagesData);
          this.dataSource=new MatTableDataSource(this.OfficerImagesData);
        } else {
          this.grivanceData = [];
          if (res.statusCode != "404") {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  viewDocument(ele: any) { 
      window.open(ele, '_blank'); 
  }

  closeDialog() {
    this.dialogRef.close('Yes');
  }
}
