import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { ApiService } from 'src/app/core/service/api.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from 'src/app/configs/config.service';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { debounceTime, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { ConfirmationComponent } from '../dialogs/confirmation/confirmation.component';
@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit, AfterViewInit, OnDestroy {
  userFrm!: FormGroup;
  filterFrm: FormGroup | any;
  // displayedColumns: string[] = ['srno', 'name', 'departmentName', 'officeName', 'userType', 'mobileNo', 'isBlock', 'action', 'button', 'select'];
  displayedColumns: string[] = ['srno', 'name', 'departmentName', 'officeName', 'subUserType', 'mobileNo', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('formDirective') formDirective!: NgForm;
  dataSource: any;
  userBlockFlag: boolean = false;
  totalRows: number = 0;
  pageNumber: number = 1;
  stateArray = new Array();
  usersArray = new Array();
  subUsersArray = new Array();
  departmentArray = new Array();
  departmentByUserArray=new Array();
  officeArray = new Array();
  highlightedRow!: number;
  userTypeArray: any[] = [{ "userTypeId": 1, "userType": "HOD" }, { "userTypeId": 2, "userType": "Nodal Officer" }, { "userTypeId": 3, "userType": "Clerk" }]
  blockStsArr: any[] = [{ value: true, status: 'Block' }, { value: false, status: 'Unblock' }];
  subscription!: Subscription;
  isEdit: boolean = false;
  updatedObj: any;
  users: any;
  selection = new SelectionModel<Element>(true, []);
  changeDepFlag:boolean = false;


  constructor(public commonMethod: CommonMethodService,
    public apiService: ApiService,
    public validation: FormsValidationService,
    public error: ErrorHandlerService,
    public dialog: MatDialog,
    public configService: ConfigService,
    public commonService: CommonApiService,
    public localStrorageData: WebStorageService,
    private fb: FormBuilder,
    private webStorage: WebStorageService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.defaultForm();
    this.filterForm();
    this.getData();
    this.getUsers(this.localStrorageData.getUserId());
    // this.getDepartment();
    this.getDepartment();
  }

  //#region  filter form fn Start here



  filterForm() {
    this.filterFrm = this.fb.group({
      deptId: [0],
      officeId: [0],
      textSearch: ['']
    })
  }

  //#endregion filter form fn end here

  //#region  user form form fn Start here
  defaultForm() {
    this.userFrm = this.fb.group({
      userTypeId: ['', [Validators.required]],
      subUserTypeId: ['', [Validators.required]],
      deptId: ['', [Validators.required]],
      officeId: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.pattern(this.validation.valName)]],
      mobileNo: ['', [Validators.required, Validators.pattern(this.validation.valMobileNo), Validators.minLength(10), Validators.maxLength(10)]],
      emailId: ['', [Validators.required, Validators.pattern(this.validation.valEmailId)]],
    })
  }
  //#endregion filter form fn end heare

  get f() {
    return this.userFrm.controls;
  }

  //#region  search  fn Start here

  ngAfterViewInit() {
    let formValue: any = this.filterFrm.controls.textSearch.valueChanges;
    formValue.pipe(filter(() => this.filterFrm.valid),
      debounceTime(0),
      distinctUntilChanged()).subscribe(() => {
        this.pageNumber = 1;
        this.getData();
        this.totalRows > 10 && this.pageNumber == 1 ? this.paginator?.firstPage() : '';
        this.onCancelRecord();
      });

  }

  //#endregion search  fn end here


  //#region  clear filter  fn Start here
  clearFilter(flag: any) {
    switch (flag) {
      case 'department':
        this.filterFrm.controls['officeId'].setValue(0);
        this.filterFrm.controls['textSearch'].setValue('');
        break;
      case 'office':
        this.filterFrm.controls['textSearch'].setValue('');
        break;
      default:
    }

  }
  //#endregion clear filter  fn end here

  getUsers(userId:number) {
    this.usersArray = [];
    this.commonService.getAllUserByUserId(userId).subscribe({
      next: (response: any) => {
        this.usersArray.push(...response);
        this.changeDepFlag == true ? (this.userFrm.controls['userTypeId'].setValue(this.commonMethod.checkDataType(this.updatedObj?.userTypeId) == false ? '' : this.updatedObj?.userTypeId),
         this.getSubUsers(this.commonMethod.checkDataType(this.updatedObj?.userTypeId) == false ? '' : this.updatedObj?.userTypeId)) : '';
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }

  getSubUsers(usertypeId: number) {
    this.subUsersArray = [];
    this.commonService.getAllSubUser(usertypeId).subscribe({
      next: (response: any) => {
        this.subUsersArray.push(...response);
        this.changeDepFlag == true ? (this.userFrm.controls['subUserTypeId'].setValue(this.commonMethod.checkDataType(this.updatedObj?.subUserTypeId) == false ? '' : this.updatedObj?.subUserTypeId)) :this.userFrm.controls['subUserTypeId'].setValue('');
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }



  //#region  drop down department bind  fn Start here
  // getDepartment() {
  //   this.departmentArray = [];
  //   this.commonService.getAllDepartment().subscribe({
  //     next: (response: any) => {
  //       this.departmentArray.push(...response);
  //       this.changeDepFlag == true ? (this.userFrm.controls['deptId'].setValue(this.commonMethod.checkDataType(this.updatedObj?.deptId) == false ? '' : this.updatedObj?.deptId),
  //        this.getOffice(this.commonMethod.checkDataType(this.updatedObj?.deptId) == false ? '' : this.updatedObj?.deptId)) : '';
  //     },
  //     error: ((error: any) => { this.error.handelError(error.status) })
  //   })
  // }
  //#endregiondrop down department bind fn end here

  getDepartment() {
    this.departmentByUserArray = [];
    this.commonService.getAllDepartment().subscribe({
      next: (response: any) => {
        this.departmentByUserArray.push(...response);
        this.changeDepFlag == true ? (this.userFrm.controls['deptId'].setValue(this.commonMethod.checkDataType(this.updatedObj?.deptId) == false ? '' : this.updatedObj?.deptId),
         this.getOffice(this.commonMethod.checkDataType(this.updatedObj?.deptId) == false ? '' : this.updatedObj?.deptId)) : '';
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }

  //#region  drop down office bind  fn Start here
  getOffice(deptNo: number) {
    if (deptNo == 0) {
      return;
    }
    this.officeArray = [];
    this.commonService.getOfficeByDeptId(deptNo).subscribe({
      next: (response: any) => {
        this.officeArray.push(...response);

        this.changeDepFlag == true ? (this.userFrm.controls['officeId'].setValue(this.commonMethod.checkDataType(this.updatedObj?.officeId) == false ? '' : this.updatedObj?.officeId)) : '';
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }
  //#endregiondrop down office bind fn end here


  filterData() {
    this.pageNumber = 1;
    this.getData();
    this.onCancelRecord();
  }

  setValidators(flag: any) {

    switch (flag) {
      case 2:
              this.userFrm.controls['deptId'].setValue('');
              this.userFrm.controls['deptId'].clearValidators();
              this.userFrm.controls['deptId'].updateValueAndValidity();
              this.userFrm.controls['officeId'].setValue('');
              this.userFrm.controls['officeId'].clearValidators();
              this.userFrm.controls['officeId'].updateValueAndValidity();
              break;

       case 3:
                this.userFrm.controls["deptId"].setValidators([Validators.required]);
                this.userFrm.controls["deptId"].updateValueAndValidity();
                this.userFrm.controls['officeId'].setValue('');
                this.userFrm.controls['officeId'].clearValidators();
                this.userFrm.controls['officeId'].updateValueAndValidity();
                break;
      default:
                this.userFrm.controls["deptId"].setValidators([Validators.required]);
                this.userFrm.controls["deptId"].updateValueAndValidity();
                this.userFrm.controls["officeId"].setValidators([Validators.required]);
                this.userFrm.controls["officeId"].updateValueAndValidity();

    }
  }

  //#region  bind table  fn Start here
  getData() {
    this.spinner.show()
    let formValue = this.filterFrm.value;
    let paramList: string = "?DeptId=" + formValue.deptId + "&OfficeId=" + formValue.officeId + "&pageno=" + this.pageNumber + "&pagesize=" + 10;
    this.commonMethod.checkDataType(formValue.textSearch.trim()) == true ? paramList += "&Textsearch=" + formValue.textSearch : '';
    this.apiService.setHttp('get', "samadhan/user-registration/GetAll" + paramList, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.users = res.responseData.responseData1;
          this.dataSource = new MatTableDataSource(this.users);
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

  //#endregiondrop  bind table fn end here


  //#region  submit and update formadata  fn Start here
  onSubmit() {
    // this.spinner.show();
    console.log(this.userFrm.controls)

    if (this.userFrm.invalid) {
      return;
    }
    let formData = this.userFrm.value;
    let obj = {
      "createdBy": this.webStorage.getUserId(),
      "modifiedBy": this.webStorage.getUserId(),
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "isDeleted": true,
      "id": this.isEdit == true ? this.updatedObj.id : 0,
      "name": formData.name,
      "mobileNo": formData.mobileNo,
      "stateId": 0,
      "districtId": 0,
      "talukaId": 0,
      "villageId": 0,
      "emailId": formData.emailId,
      "userTypeId": formData.userTypeId,
      "subUserTypeId": formData.subUserTypeId,
      "userName": formData.mobileNo,
      "password": "",
      "deptId": formData.deptId || 0,
      "officeId": formData.officeId || 0,
      "isBlock": false,
      "blockDate": new Date(),
      "blockBy": 0,
      "keyExpireDate": "2022-11-07T04:21:28.654Z",
      "deviceTypeId": 0,
      "fcmId": "",
      "profilePhoto": ""
    }

    let method = this.isEdit ? 'PUT' : 'POST';
    let url = this.isEdit ? "UpdateRecord" : "AddRecord";
    this.apiService.setHttp(method, "samadhan/user-registration/" + url, false, obj, false, 'samadhanMiningService');
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.highlightedRow = 0;
          // this.spinner.hide();
          this.getData();
          this.onCancelRecord();
          this.selection.clear();
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 0);
        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
        }
        // this.spinner.hide();
      },
      error: ((error: any) => { this.error.handelError(error.status); this.spinner.hide(); })
    })
  }
  //#endregiondrop   submit and update formadata fn end here

  //#region  conformation user block/unblok  fn Start here
  userBlockUnBlockModal(element: any, event: any) {
    this.highlightedRow = element.id;
    let Title: string, dialogText: string;
    event.checked == true ? Title = 'Block User' : Title = 'Unblock User';
    event.checked == true ? dialogText = 'Do you want to Block the user?' : dialogText = 'Do you want to Unblock the user?';
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '340px',
      data: { p1: dialogText, p2: '', cardTitle: Title, successBtnText: 'Yes', dialogIcon: 'done_outline', cancelBtnText: 'No' },
      disableClose: this.apiService.disableCloseFlag,
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.highlightedRow = 0;
      res == 'Yes' ? this.userBlockUnBlock(element, event.checked) : element.isBlock === "False" || element.isBlock == null ? event.source.checked = false : event.source.checked = true;
      this.onCancelRecord();
    });
  }

  //#endregiondrop   conformation user block/unblok  fn end here

  //#region   user block/unblok  fn Start here

  userBlockUnBlock(element: any, event: any) {
    let obj = {
      "id": element?.id,
      "isBlock": event == true ? true : false,
      "blockDate": new Date(),
      "blockBy": this.webStorage.getUserId(),
    }
    this.apiService.setHttp('PUT', "samadhan/user-registration/BlockUnblockUser", false, obj, false, 'samadhanMiningService');
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.getData();
          this.commonMethod.matSnackBar(res.statusMessage, 0);
        } else {
          if (res.statusCode != "404") {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          }
        }
      },
      error: (err: any) => { this.error.handelError(err) }
    })
  }
  //#endregiondrop   user block/unblok  fn end here

  //#region   patch form value for edit  fn Start here

  editRecord(ele: any) {
    this.highlightedRow = ele.id;
    this.isEdit = true;
    this.changeDepFlag = true;
    this.updatedObj = ele;
    this.userFrm.patchValue({
      name: this.updatedObj.name,
      mobileNo: this.updatedObj.mobileNo,
      emailId: this.updatedObj.emailId,
    });
    // this.getDepartment();
    this.getDepartment();
    this.getUsers(this.localStrorageData.getUserId());
    this.setValidators(this.updatedObj?.userTypeId);
  }

  //#endregiondrop   patch form value for edit  fn end here

  pageChanged(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.getData();
    this.onCancelRecord();
    // this.selection = new SelectionModel<Element>(true, []);
    this.selection.clear();
  }

  //#region reset form value fn Start here
  onCancelRecord() {
    this.formDirective.resetForm();
    this.isEdit = false;
  }

  //#endregiondrop reset form value fn end here

  //#region single or multiple user delete fn Start here
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.connect().value.forEach((row: any) => this.selection.select(row));
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
        this.selection = new SelectionModel<Element>(true, []);
        this.onCancelRecord();
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
          "deletedBy": this.webStorage.getUserId(),
          "modifiedDate": new Date()
        }
        delArray.push(obj)
      })
    }
    this.apiService.setHttp('DELETE', 'samadhan/user-registration/Delete', false, delArray, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.highlightedRow = 0;
          this.getData();
          this.commonMethod.matSnackBar(res.statusMessage, 0);
          this.selection.clear();
          this.onCancelRecord();
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

  //#endregiondrop single or multiple user delete fn end here

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}

