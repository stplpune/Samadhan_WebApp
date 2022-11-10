import { Component, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/service/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationComponent } from './../dialogs/confirmation/confirmation.component';
import { ConfigService } from 'src/app/configs/config.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';



@Component({
  selector: 'app-grievance-master',
  templateUrl: './grievance-master.component.html',
  styleUrls: ['./grievance-master.component.css']
})
export class GrievanceMasterComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('formDirective') formDirective!: NgForm;
  displayedColumns: string[] = [ 'srNo', 'departmentName', 'grievanceType', 'action','delete','select'];
  dataSource :any;
  frmGrievance! : FormGroup;
  totalRows:any
  totalPages: any;
  pageNo = 1;
  pageSize = 10;
  departmentArr=new Array();
  isEdit:boolean=false;
  @ViewChild('paginator') paginator!: MatPaginator;
  subscription!: Subscription;
  updatedObj: any;
  highlightedRow!: number;

  constructor(private fb: FormBuilder,private apiService:ApiService,
    public configService: ConfigService,
    public dialog: MatDialog,
    private webStorageService:WebStorageService,
    public error: ErrorHandlerService,
    private spinner: NgxSpinnerService,
    public validation: FormsValidationService,
    public commonMethod: CommonMethodService,) { }

  ngOnInit(): void {
    this.createGrievanceForm();
    this.getDepartmentName();
    this.dataDispaly();
  }
  get f() { return this.frmGrievance.controls };

createGrievanceForm(){
  this.frmGrievance = this.fb.group({
    id: 0,
    departmentName: ['', [Validators.required, Validators.pattern]],
    grievanceType:['',[Validators.required]]
  })
}

  selection = new SelectionModel<any>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.srNo + 1}`;
  }
  //------------------------------------------------------------------------Display Table----------------------------------------------------------------------
  dataDispaly(){
  this.apiService.setHttp('get', "api/Grievance/GetAll?pageno=" + this.pageNo +'&pagesize='+this.pageSize, false, false, false, 'samadhanMiningService');
  this.apiService.getHttp().subscribe({
    next: (res: any) => {
      if (res.statusCode == 200) {
        let dataSet = res.responseData;
        this.dataSource = new MatTableDataSource(dataSet);
        this.totalPages = res.responseData1.pageCount;
        this.pageNo == 1 ? this.paginator.firstPage():'';
      }else{
        this.dataSource=[];
      }
      }

      });
    }
  //------------------------------------------------------------------------Get Department--------------------------------------------------------------------------------

  getDepartmentName(){
    this.apiService.setHttp('get', "samadhan/commondropdown/GetAllDepartment", false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200'  && res.responseData.length) {
          this.departmentArr = res.responseData;
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }
//------------------------------------------------------------------------Submit-------------------------------------------------------------------------------------------
onSubmitGrievance(){
    this.spinner.show();
    if (this.frmGrievance.invalid) {
      return;
    }
    let formData = this.frmGrievance.value;
    console.log(formData);
    let obj = {
      "createdBy": 0,
      "modifiedBy": 0,
      "createdDate": "2022-11-09T06:58:26.532Z",
      "modifiedDate": "2022-11-09T06:58:26.532Z",
      "isDeleted": true,
      "id":this.isEdit == true ? this.updatedObj.id : 0,
      "deptId": 0,
      "name": formData.name,
      "address": formData.address,
      "emailId": formData.emailId,
      "contactPersonName": formData.contactPersonName,
      "mobileNo": formData.mobileNo
    }

    let method = this.isEdit ? 'PUT' : 'POST';
    let url = this.isEdit ? "UpdateOfficeDetails" : "AddOfficeDetails";
    this.apiService.setHttp(method, "samadhan/office/" + url, false, obj, false, 'samadhanMiningService');
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.highlightedRow = 0;
          this.spinner.hide();
          this.dataDispaly();
          this.onCancelRecord();
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 0);
        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
        }
        this.spinner.hide();
      },
      error: ((error: any) => { this.error.handelError(error.status); this.spinner.hide(); })
    })
  }

 //--------------------------------------------------------------------------delete-----------------------------------------------------------------------------
 deleteCoalGrade(row:any){
  let obj:any = ConfigService.dialogObj;
  obj['p1'] = 'Are you sure you want to delete this record?';
  obj['cardTitle'] = 'Delete';
  obj['successBtnText'] = 'Delete';
  obj['cancelBtnText'] =  'Cancel';

  const dialog = this.dialog.open(ConfirmationComponent, {
    width:this.configService.dialogBoxWidth[0],
    data: obj,
    disableClose: this.configService.disableCloseBtnFlag,
  })
  dialog.afterClosed().subscribe(res => {
    if(res == "Yes"){
      var req = {
      "id":row.id,
    "deletedBy": this.webStorageService.getUserId(),
    "modifiedDate": new Date().toISOString(),

      }
  this.apiService.setHttp('DELETE', "api/Grievance/DeleteGrievance", false, req, false, 'samadhanMiningService');
  this.apiService.getHttp().subscribe({
    next: (res: any) => {
      if (res.statusCode == "200") {
        this.commonMethod.matSnackBar(res.statusMessage, 0);
        this.dataDispaly();
      } else {
        this.commonMethod.matSnackBar('Colliery record is deleted!', 0);
      }
    },
    error: ((error: any) => { this.error.handelError(error.status) })
  });
}
})
 }

//------------------------------------------------------------------------Pagination-----------------------------------------------------------------------------
pageChanged(event:any){
      this.pageNo = event.pageIndex+1;
      this.dataDispaly();
    }


    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
onCancelRecord() {
  this.formDirective.resetForm();
  this.isEdit = false;
}

  }

// export interface PeriodicElement {
//   srNo: number;
//   departmentName: string;
//   grievanceType: string;
//   action: any;
// }

// const ELEMENT_DATA: PeriodicElement[] = [

// ];

