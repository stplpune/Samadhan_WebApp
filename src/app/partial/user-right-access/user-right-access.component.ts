import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigService } from 'src/app/configs/config.service';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { ApiService } from 'src/app/core/service/api.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';

@Component({
  selector: 'app-user-right-access',
  templateUrl: './user-right-access.component.html',
  styleUrls: ['./user-right-access.component.css']
})
export class UserRightAccessComponent implements OnInit {

  UserTypeArr = new Array();
  SubUserTypeArr = new Array();
  userRightFrm !: FormGroup;
  pageNumber: number = 1;
  pageSize: number = 10;
  dataSource: any;
  displayedColumns: string[] = ['srno', 'pageName', 'pageURL', 'menuIcon', 'select'];
  totalRows: number = 0;
  highlightedRow!: number;
  initialLoadFlag: boolean = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    public error: ErrorHandlerService,
    public validation: FormsValidationService,
    private spinner: NgxSpinnerService,
    public configService: ConfigService,
    private webStorage: WebStorageService,
    public commonMethod: CommonMethodService,
    public commonService: CommonApiService
    ) { }

  ngOnInit(): void {
    this.assignUserRightsForm();
    this.getUserType();
  }

  getUserType() {
    this.UserTypeArr = [];
    this.SubUserTypeArr = [];
    this.commonService.getAllUser().subscribe({
      next: (response: any) => {
        this.UserTypeArr.push(...response);
        if(this.UserTypeArr.length > 0){
          this.userRightFrm.patchValue({
            userType: this.UserTypeArr[0].userTypeId
          })
          this.getSubUserType(this.UserTypeArr[0].userTypeId);
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }

  getSubUserType(id: any){
    this.SubUserTypeArr = [];
    this.commonService.getAllSubUser(id).subscribe({
      next: (response: any) => {
        this.SubUserTypeArr.push(...response);
        if(this.SubUserTypeArr.length > 0){
          this.userRightFrm.patchValue({
            subUserType: this.SubUserTypeArr[0].subUserTypeId
          })
          this.initialLoadFlag ? this.getUserRightPageList() : '';
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }

  assignUserRightsForm() {
    this.userRightFrm = this.fb.group({
      userType: [''],
      subUserType: [''],
      pageName: ['']
    });
  }

  getUserRightPageList(){
    this.spinner.show()
    let paramList: string = "?UserTypeId=" + this.userRightFrm.value.userType + "&SubUserTypeId=" + this.userRightFrm.value.subUserType + "&Textsearch=" + this.userRightFrm.value.pageName.trim() + "&pageno=" + this.pageNumber + "&pagesize=" + this.pageSize;
    this.apiService.setHttp('get', "samadhan/user-pages/GetByCriteria" + paramList, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.dataSource = new MatTableDataSource(res.responseData.responseData1);
          this.dataSource.sort = this.sort;
          this.totalRows = res.responseData.responseData2.pageCount;
          this.pageNumber == 1 ? this.paginator?.firstPage() : '';
          this.spinner.hide();
        } else {
        
          this.spinner.hide();
          this.dataSource = []
          this.totalRows = 0;
          if (res.statusCode != "404") {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  pageChanged(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.getUserRightPageList();
  }

  onSubmit() {
    this.pageNumber == 1 ? this.paginator?.firstPage() : '';
    this.getUserRightPageList();
  }

  addUpdatePageRights(event: any, pageId: any, id: any) {
    var req = {
      "id": id,
      "userTypeId": this.userRightFrm.value.userType,
      "pageId": pageId,
      // "isReadWriteAccess": event,
      "readRight": event,
      "writeRight": event,
      "subUserTypeId": this.userRightFrm.value.subUserType,
      "createdBy": this.webStorage.getUserId(),
      "modifiedBy": this.webStorage.getUserId(),
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "isDeleted": true,
    }
    var reqArr = new Array();
    reqArr.push(req);
    this.apiService.setHttp('Post', "samadhan/user-pages/AddRecord", false, reqArr, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.commonMethod.matSnackBar(res.statusMessage, event ? 0 : 1);
          this.getUserRightPageList();
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }
  resetFilter(){
    this.assignUserRightsForm();
    this.getUserType();
    this.initialLoadFlag = true;
  }

}
