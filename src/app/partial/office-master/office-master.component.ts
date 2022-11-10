import {AfterViewInit,Component,OnDestroy,OnInit,ViewChild,}from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/service/api.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { ConfirmationComponent } from './../dialogs/confirmation/confirmation.component';
import { ConfigService } from 'src/app/configs/config.service';
// import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/service/web-storage.service';

@Component({
  selector: 'app-office-master',
  templateUrl: './office-master.component.html',
  styleUrls: ['./office-master.component.css'],
})
export class OfficeMasterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('formDirective') formDirective!: NgForm;
  displayedColumns: string[] = [
    'srNo',
    'departmentName',
    'officeName',
    'weight',
    'delete',
    'select',
  ];
  dataSource: any;
  frmOffice!: FormGroup;
  totalRows: any;
  departmentArr: any;
  officeArray: any;
  totalPages: any;
  pageNo = 0;
  pageSize = 10;
  isEdit: boolean = false;
  subscription!: Subscription;
  updatedObj: any;
  highlightedRow!: number;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public error: ErrorHandlerService,
    private spinner: NgxSpinnerService,
    public configService: ConfigService,
    public validation: FormsValidationService,
    public localStrorageData: WebStorageService,
    private webStorage:WebStorageService,
    public dialog: MatDialog,
    public commonMethod: CommonMethodService
  ) {}


  ngOnInit(): void {
    this.createOfficeForm();
    this.getDepartmentName();
    this.getOfficeName();
    this.dataDispaly();
  }
  get f() {
    return this.frmOffice.controls;
  }

//---------------------------------------------------------------------------Office Form----------------------------------------------------------------
  createOfficeForm() {
    this.frmOffice = this.fb.group({
      deptId: ['', [Validators.required]],
      name: ['',[Validators.required, Validators.pattern(this.validation.valName)],],
      address: ['',[Validators.required,Validators.pattern(this.validation.alphaNumericWithSpaceAndSpecialChar),],],
      emailId: ['',[Validators.required, Validators.pattern(this.validation.valEmailId)],],
      contactPersonName: ['',[Validators.required, Validators.pattern(this.validation.valName)],],
      mobileNo: ['',[Validators.required,Validators.pattern(this.validation.valMobileNo),Validators.minLength(10),Validators.maxLength(10),],],
    });
  }
  //--------------------------------------------------------FilterFOrm--------------------------------------------------------------------------------------
  ngAfterViewInit(): void {}
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.srNo + 1
    }`;
  }
    //--------------------------------------------------------Department-------------------------------------------------------------------------------------------
    getDepartmentName() {
      this.apiService.setHttp(
        'get',
        'samadhan/commondropdown/GetAllDepartment',
        false,
        false,
        false,
        'samadhanMiningService'
      );
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == '200' && res.responseData) {
            this.departmentArr = res.responseData;
          }
        },
      });
    }
    //------------------------------------------------------------Office---------------------------------------------------------------------------------------------
    getOfficeName() {
      this.apiService.setHttp(
        'get',
        'samadhan/commondropdown/GetAllOffice',
        false,
        false,
        false,
        'samadhanMiningService'
      );
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == '200' && res.responseData) {
            this.officeArray = res.responseData;
          }
        },
      });
    }

  //-------------------------------------------------------------Dispaly Table-----------------------------------------------------------------------------
  dataDispaly() {
    this.apiService.setHttp(
      'get',
      'samadhan/office/GetAll?pageno=' +
        (this.pageNo + 1) +
        '&pagesize=' +
        this.pageSize,
      false,
      false,
      false,
      'samadhanMiningService'
    );
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          let dataSet = res.responseData;
          this.dataSource = new MatTableDataSource(dataSet);
          this.totalPages = res.responseData1.pageCount;
        } else {
          this.dataSource = [];
        }
      },
    });
  }
  //-------------------------------------------------------Submit----------------------------------------------------------------------------------------------------
  onSubmitOffice() {
    this.spinner.show();
    if (this.frmOffice.invalid) {
      return;
    }
    let formData = this.frmOffice.value;
    console.log(formData);
    let obj = {
      "createdBy": this.webStorage.getUserId(),
      "modifiedBy": this.webStorage.getUserId(),
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "isDeleted": true,
      "id": this.isEdit == true ? this.updatedObj.id : 0,
      "deptId": formData.deptId,
      "name": formData.name,
      "address": formData.address,
      "emailId": formData.emailId,
      "contactPersonName": formData.contactPersonName,
      "mobileNo": formData.mobileNo,
    };

    let method = this.isEdit ? 'PUT' : 'POST';
    let url = this.isEdit ? 'UpdateOfficeDetails' : 'AddOfficeDetails';
    this.apiService.setHttp(
      method,
      'samadhan/office/' + url,
      false,
      obj,
      false,
      'samadhanMiningService'
    );
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.highlightedRow = 0;
          this.spinner.hide();
          this.dataDispaly();
          this.onCancelRecord();
          this.commonMethod.checkDataType(res.statusMessage) == false
            ? this.error.handelError(res.statusCode)
            : this.commonMethod.matSnackBar(res.statusMessage, 0);
        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false
            ? this.error.handelError(res.statusCode)
            : this.commonMethod.matSnackBar(res.statusMessage, 1);
        }
        this.spinner.hide();
      },
      error: (error: any) => {
        this.error.handelError(error.status);
        this.spinner.hide();
      },
    });
  }
  //----------------------------------------------------------------------------Edit---------------------------------------------------------------------------------
  editRecord(ele: any) {
    this.highlightedRow = ele.id;
    this.isEdit = true;
    this.updatedObj = ele;
    console.log(this.updatedObj);
    this.frmOffice.patchValue({
      deptId: this.updatedObj.deptId,
      name: this.updatedObj.officeName,
      address: this.updatedObj.officeAddress,
      emailId: this.updatedObj.officeEmailId,
      contactPersonName: this.updatedObj.contactPersonName,
      mobileNo: this.updatedObj.contactPersonMobileNo,
    });
  }
    //--------------------------------------------------------Pagination-------------------------------------------------------------------------------------------
    pageChanged(event: any) {
      this.pageNo = event.pageIndex;
      this.pageSize = event.pageSize;
      this.dataDispaly();
    }
  //---------------------------------------------------------------------------Cancle--------------------------------------------------------------------------------------
  onCancelRecord() {
    this.formDirective.resetForm();
    this.isEdit = false;
  }
  //------------------------------------------------------------------------------Delete----------------------------------------------------------------------------------
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
      data: {
        p1: 'Are you sure you want to delete this record?',
        p2: '',
        cardTitle: 'Delete',
        successBtnText: 'Delete',
        dialogIcon: '',
        cancelBtnText: 'Cancel',
      },
      disableClose: this.apiService.disableCloseFlag,
    });
    dialog.afterClosed().subscribe((res) => {
      if (res == 'Yes') {
        this.deleteUser();
      } else {
        this.selection.clear();
      }
    });
  }

  deleteUser() {
    let selDelArray = this.selection.selected;
    let delArray = new Array();
    if (selDelArray.length > 0) {
      selDelArray.find((ele: any) => {
        let obj = {
          id: ele.id,
          deletedBy: 0,
          modifiedDate: new Date(),
        };
        delArray.push(obj);
      });
    }
    this.apiService.setHttp(
      'DELETE',
      'samadhan/office/Delete',
      false,
      delArray,
      false,
      'samadhanMiningService'
    );
    this.apiService.getHttp().subscribe(
      {
        next: (res: any) => {
          if (res.statusCode === '200') {
            this.highlightedRow = 0;
            this.dataDispaly();
            this.commonMethod.matSnackBar(res.statusMessage, 0);
            this.selection.clear();
          } else {
            if (res.statusCode != '404') {
              this.error.handelError(res.statusMessage);
            }
          }
        },
      },
      (error: any) => {
        this.spinner.hide();
        this.error.handelError(error.status);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
// export interface PeriodicElement {
//   departmentName: string;
//   srNo: number;
//   weight:any;
// }

// const ELEMENT_DATA: PeriodicElement[] = [

// ];
