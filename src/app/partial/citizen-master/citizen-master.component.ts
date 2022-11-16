import { Component, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { ApiService } from 'src/app/core/service/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigService } from 'src/app/configs/config.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { Subscription } from 'rxjs';
import { ConfirmationComponent } from './../dialogs/confirmation/confirmation.component';



@Component({
  selector: 'app-citizen-master',
  templateUrl: './citizen-master.component.html',
  styleUrls: ['./citizen-master.component.css']
})
export class CitizenMasterComponent implements OnInit {
  @ViewChild('formDirective') formDirective!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [ 'srno', 'name', 'mobileno','emailId', 'taluka','village', 'select'];
  dataSource: any;
  frmCitizen!:FormGroup;
  filterForm!:FormGroup;
  isEdit: boolean = false;
  totalRows: any;
  totalPages: any;
  pageNo = 1;
  pageSize = 10;
  highlightedRow!:number;
  subscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public error: ErrorHandlerService,
    private spinner: NgxSpinnerService,
    public configService: ConfigService,
    public validation: FormsValidationService,
    public localStrorageData: WebStorageService,
    // private webStorage:WebStorageService,
    public dialog: MatDialog,
    public commonMethod: CommonMethodService
  ) { }

  ngOnInit(): void {
  }

//----------------------------------------------------------------FormStart---------------------------------------------------------------------------------------
  createCitizenForm(){
    this.frmCitizen = this.fb.group({

    })
  }

  selection = new SelectionModel<any>(true, []);
//--------------------------------------------------------Department-------------------------------------------------------------------------------------------
// getDepartmentName() {
//   this.apiService.setHttp(
//     'get',
//     'samadhan/commondropdown/GetAllDepartment',
//     false,
//     false,
//     false,
//     'samadhanMiningService'
//   );
//   this.apiService.getHttp().subscribe({
//     next: (res: any) => {
//       if (res.statusCode == '200' && res.responseData) {
//         this.departmentArr = res.responseData;
//       }
//     },
//   });
// }
//------------------------------------------------------------Office---------------------------------------------------------------------------------------------
// getOfficeName() {
//   this.apiService.setHttp(
//     'get',
//     'samadhan/commondropdown/GetAllOffice',
//     false,
//     false,
//     false,
//     'samadhanMiningService'
//   );
//   this.apiService.getHttp().subscribe({
//     next: (res: any) => {
//       if (res.statusCode == '200' && res.responseData) {
//         this.officeArray = res.responseData;
//       }
//     },
//   });
// }

//-------------------------------------------------------------Dispaly Table-----------------------------------------------------------------------------
getData() {
this.spinner.show()
let formData = this.filterForm.value;
this.apiService.setHttp('get','samadhan/user-registration/GetAllCitizen?Textsearch='+formData.name +'&pageno=' +this.pageNo+'&pagesize=' +this.pageSize ,false,false,false,'samadhanMiningService');
this.apiService.getHttp().subscribe({
  next: (res: any) => {
    if (res.statusCode == 200) {
      let dataSet = res.responseData;
      this.dataSource = new MatTableDataSource(dataSet);
      this.totalPages = res.responseData1.pageCount;
      this.spinner.hide();
    } else {
      this.spinner.hide();
      this.dataSource = [];
      this.totalPages = 0;
    }
  },
});
}
//-------------------------------------------------------Submit----------------------------------------------------------------------------------------------------
// onSubmitOffice() {

// if (this.frmOffice.invalid) {
//   return;
// }
// let formData = this.frmOffice.value;
// let obj = {
//   "createdBy": this.webStorage.getUserId(),
//   "modifiedBy": this.webStorage.getUserId(),
//   "createdDate": new Date(),
//   "modifiedDate": new Date(),
//   "isDeleted": true,
//   "id": this.isEdit == true ? this.updatedObj.id : 0,
//   "deptId": formData.deptId,
//   "name": formData.name,
//   "address": formData.address,
//   "emailId": formData.emailId,
//   "contactPersonName": formData.contactPersonName,
//   "mobileNo": formData.mobileNo,
// };

// let method = this.isEdit ? 'PUT' : 'POST';
// let url = this.isEdit ? 'UpdateOfficeDetails' : 'AddOfficeDetails';
// this.apiService.setHttp(
//   method,
//   'samadhan/office/' + url,
//   false,
//   obj,
//   false,
//   'samadhanMiningService'
// );
// this.subscription = this.apiService.getHttp().subscribe({
//   next: (res: any) => {
//     if (res.statusCode == 200) {
//       this.highlightedRow = 0;
//       this.getData();
//       this.onCancelRecord();
//       this.commonMethod.checkDataType(res.statusMessage) == false? this.error.handelError(res.statusCode): this.commonMethod.matSnackBar(res.statusMessage, 0);
//     } else {
//       this.commonMethod.checkDataType(res.statusMessage) == false? this.error.handelError(res.statusCode): this.commonMethod.matSnackBar(res.statusMessage, 1);
//     }

//   },
//   error: (error: any) => {
//     this.error.handelError(error.status);
//     this.spinner.hide();
//   },
// });
// }
//----------------------------------------------------------------------------Edit---------------------------------------------------------------------------------
// editRecord(ele: any) {
// this.highlightedRow = ele.id;
// this.isEdit = true;
// this.updatedObj = ele;
// this.frmOffice.patchValue({
//   deptId: this.updatedObj.deptId,
//   name: this.updatedObj.officeName,
//   address: this.updatedObj.officeAddress,
//   emailId: this.updatedObj.officeEmailId,
//   contactPersonName: this.updatedObj.contactPersonName,
//   mobileNo: this.updatedObj.contactPersonMobileNo,
// });
// }
//-------------------------------------------------------------------------CancleRecord-----------------------------------------------------------------------
onCancelRecord() {
  this.formDirective.resetForm();
  this.isEdit = false;
}

//-------------------------------------------------------------------------Pagination-------------------------------------------------------------------------------
pageChanged(event: any){
  this.pageNo = event.pageIndex + 1;
  this.onCancelRecord();
  this.selection.clear();
}

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  // toggleAllRows() {
  //   if (this.isAllSelected()) {
  //     this.selection.clear();
  //     return;
  //   }

  //   this.selection.select(...this.dataSource.data);
  // }

  // checkboxLabel(row?: PeriodicElement): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.srno + 1}`;
  // }
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
    selDelArray.find((data: any) => {
      let obj = {
        id: data.id,
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
          this.getData();
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
  this.onCancelRecord();
}

ngOnDestroy() {
  this.subscription?.unsubscribe();
}
}


// export interface PeriodicElement {
//   srno:number;
//   name: string;
//   mobileno: number;
//   emailId: any;
//   taluka: string;
//   village:string;
//   action:any;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {srno: 1, name: 'Hydrogen', mobileno: 8669264767, emailId: 'H@gmail.com',taluka:'Pune',village:'Rajgrurnagar',action:''},
//   {srno: 2, name: 'Hydrogen', mobileno: 8669264767, emailId: 'H@gmail.com',taluka:'Pune',village:'Rajgrurnagar',action:''},
//   {srno: 3, name: 'Hydrogen', mobileno: 8669264767, emailId: 'H@gmail.com',taluka:'Pune',village:'Rajgrurnagar',action:''},

// ];
