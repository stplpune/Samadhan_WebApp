import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/service/api.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationComponent } from './../dialogs/confirmation/confirmation.component';
import { ConfigService } from 'src/app/configs/config.service';
import { MatDialog } from '@angular/material/dialog';
// import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-department-master',
  templateUrl: './department-master.component.html',
  styleUrls: ['./department-master.component.css']
})
export class DepartmentMasterComponent implements OnInit,AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('formDirective') formDirective!: NgForm;
  displayedColumns: string[] = [ 'srNo', 'departmentName', 'weight','delete','select'];
  dataSource:any;
  frmDepartment!: FormGroup;
  totalRows:any;
  filterForm!:FormGroup;
  isEdit: boolean = false;
  totalPages: any;
  pageNo = 0;
  pageSize = 10;
  deptType : string = '';
  subscription!: Subscription;
  updatedObj: any;
  highlightedRow!: number;
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(private fb: FormBuilder,
    public configService: ConfigService,
    // private webStorageService:WebStorageService,
    public dialog: MatDialog,
    private apiService:ApiService,
    public error: ErrorHandlerService,
    private spinner: NgxSpinnerService,
    public validation: FormsValidationService,
    public commonMethod: CommonMethodService,
    ) { }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.createDepartmentForm();
    this.filterMethod();
    this.dataDispaly();
  }

  get f() { return this.frmDepartment.controls };
//-------------------------------------------------------------------------Start Form-----------------------------------------------------------------------------------------
  createDepartmentForm(){
    this.frmDepartment = this.fb.group({
      departmentName: ['', [Validators.required, Validators.pattern(this.validation.valName)]],

    })
  }

  filterMethod() {
    this.filterForm = this.fb.group({
      deptName: [''],
    })
  }

  selection = new SelectionModel<any>(true, []);

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

  //-----------------------------------------------------------------------Display Table --------------------------------------------------------------------------------
dataDispaly(){
  this.apiService.setHttp('get', "samdhan/Department/GetAllDepartments?&pageno="+ (this.pageNo + 1) +'&pagesize='+ this.pageSize, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          let dataSet = res.responseData;
          this.dataSource = new MatTableDataSource(dataSet);
          this.totalPages = res.responseData1.pageCount;
          // this.pageNo == 1? this.paginator.firstPage():'';

        }else{
          this.dataSource=[];
        }
      }
        });
}

  //----------------------------------------------------------------------Submit----------------------------------------------------------------------------------
  onSubmitDepartment(){
    this.spinner.show();
    if (this.frmDepartment.invalid) {
      return;
    }
    let formData = this.frmDepartment.value;
    console.log(formData);
    let obj = {
      "createdBy": 0,
      "modifiedBy": 0,
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "isDeleted": true,
      "id":this.isEdit == true ? this.updatedObj.id : 0,
      "departmentName": formData.departmentName,
    }

    let method = this.isEdit ? 'PUT' : 'POST';
    let url = this.isEdit ? "UpdateDepartment" : "AddDepartment";
    this.apiService.setHttp(method, "samdhan/Department/" + url, false, obj, false, 'samadhanMiningService');
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

  //--------------------------------------------------------------------Pagination-----------------------------------------------------------------------------
  pageChanged(event:any){
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
    this.dataDispaly();
  }
 //-----------------------------------------------------------------------cancle------------------------------------------------------------------------------
 onCancelRecord() {
  this.formDirective.resetForm();
  this.isEdit = false;
}

//-------------------------------------------------------------------------filter----------------------------------------------------------------------
// deleteConformation(id: any) {
//   this.highlightedRow = id;
//   let obj: any = ConfigService.dialogObj;
//   obj['p1'] = 'Are you sure you want to delete this record?';
//   obj['cardTitle'] = 'Delete';
//   obj['successBtnText'] = 'Delete';
//   obj['cancelBtnText'] = 'Cancel';
//   obj['inputType'] = false;
//   const dialog = this.dialog.open(ConfirmationComponent, {
//     width: this.configService.dialogBoxWidth[0],
//     data: obj,
//     disableClose: this.configService.disableCloseBtnFlag,
//   })
//   dialog.afterClosed().subscribe(res => {
//     if (res == 'Yes') {
//       this.deleteCoalGrade();
//     }
//   })

// }

//------------------------------------------------------filter----------------------------------------------------------------------------------------
filterRecord() {
  this.deptType = this.filterForm.value.departmentName;
  this.dataDispaly()
}

//------------------------------------------------------------------Update--------------------------------------------------------------------------------
editRecord(ele: any) {
  this.highlightedRow = ele.id;
  this.isEdit = true;
  this.updatedObj = ele;
  console.log(this.updatedObj);
  this.frmDepartment.patchValue({
  departmentName: this.updatedObj.departmentName,

  });
}
//---------------------------------------------------------------------------Delete---------------------------------------------------------------------------------------
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;

}

masterToggle() {
  this.isAllSelected()
    ? this.selection.clear()
    : this.dataSource.data.forEach((row: any) => this.selection.select(row));
}


deleteUserData() {
  const dialog = this.dialog.open(ConfirmationComponent, {
    width: '400px',
    data: { p1: 'Are you sure you want to delete this record?', p2: '', cardTitle: 'Delete', successBtnText: 'Delete', dialogIcon: '', cancelBtnText: 'Cancel' },
    disableClose: this.apiService.disableCloseFlag,
  })
  dialog.afterClosed().subscribe(res => {
    if (res == 'Yes') {
      this.deleteUser();
    } else {
      this.selection.clear();
    }
  })
}

deleteUser() {
  let selDelArray = this.selection.selected;
  let delArray = new Array();
  if (selDelArray.length > 0) {
    selDelArray.find((ele: any) => {
      let obj = {
        "id": ele.id,
        "deletedBy": 0,
        "modifiedDate": new Date()
      }
      delArray.push(obj)
    })
  }
  this.apiService.setHttp('DELETE', 'samdhan/Department/DeleteDepartment', false, delArray, false, 'samadhanMiningService');
  this.apiService.getHttp().subscribe({
    next: (res: any) => {
      if (res.statusCode === "200") {
        this.highlightedRow = 0;
        this.dataDispaly();
        this.commonMethod.matSnackBar(res.statusMessage, 0);
      } else {
        if (res.statusCode != "404") {
          this.error.handelError(res.statusMessage)
        }
      }
    }
  }, (error: any) => {
    this.spinner.hide();
    this.error.handelError(error.status);
  });

}


ngOnDestroy() {
  this.subscription?.unsubscribe();
}
}
// export interface PeriodicElement {
//   departmentName: string;
//   srNo: number;
//   weight:any;
// }

// const ELEMENT_DATA: PeriodicElement[] = [

// ];
