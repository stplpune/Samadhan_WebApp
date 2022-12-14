import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { ApiService } from 'src/app/core/service/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigService } from 'src/app/configs/config.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { debounceTime, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { ConfirmationComponent } from './../dialogs/confirmation/confirmation.component';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-citizen-master',
  templateUrl: './citizen-master.component.html',
  styleUrls: ['./citizen-master.component.css']
})

export class CitizenMasterComponent implements OnInit {
  @ViewChild('formDirective') formDirective!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // displayedColumns: string[] = [ 'srno', 'name', 'mobileNo','emailId', 'taluka','village','action','delete','select'];
  displayedColumns: string[] = ['srno', 'name', 'mobileNo', 'emailId', 'taluka', 'village', 'action'];
  dataSource: any;
  frmCitizen!: FormGroup;
  filterForm!: FormGroup;
  isEdit: boolean = false;
  totalPages: any;
  pageNo = 1;
  pageSize = 10;
  highlightedRow!: number;
  subscription!: Subscription;
  talukaArr = new Array();
  villageArr = new Array();
  filterVillageArry = new Array();
  updatedObj: any;
  changevillFlag: boolean = false;
  isdisable = false;
  langTypeName:any;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public error: ErrorHandlerService,
    private spinner: NgxSpinnerService,
    public configService: ConfigService,
    public validation: FormsValidationService,
    public localStrorageData: WebStorageService,
    public commonService: CommonApiService,
    public dialog: MatDialog,
    public commonMethod: CommonMethodService,
    public translate: TranslateService, 
  ) { }

  ngOnInit(): void {
    this.createCitizenForm();
    this.getTalukaName(false);
    this.getVillageFilter(0);
    this.getData();

    this.localStrorageData.langNameOnChange.subscribe(message => {
      this.langTypeName = message;
     });
  }

  //#region createCitizenForm and filterForm start
  createCitizenForm() {
    this.frmCitizen = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(this.validation.valName)],],
      mobileNo: ['', [Validators.required, Validators.pattern(this.validation.valMobileNo), Validators.minLength(10), Validators.maxLength(10),],],
      emailId: ['', [Validators.pattern(this.validation.valEmailId)],],
      talukaId: ['', [Validators.required]],
      villageId: ['', [Validators.required]]
    });

    this.filterForm = this.fb.group({
      talukaId: ['0'],
      villageId: ["0"],
      textsearch: [''],
    })
  }

  //#endregion createCitizenForm and filterForm end

  get f() {
    return this.frmCitizen.controls;
  }

  //#region Search Fun start
  ngAfterViewInit() {
    let formData: any = this.filterForm.controls['textsearch'].valueChanges;
    formData.pipe(filter(() => this.filterForm.valid),
      debounceTime(1000),
      distinctUntilChanged()).subscribe(() => {
        this.pageNo = 1;
        this.getData();
        this.selection.clear();

      });
  }

  //#endregion Search Fun end


  //#region Filter Fun start
  filterData() {
    this.pageNo = 1;
    this.getData();
    this.onCancelRecord();
  }

  //#endregion Filter Fun end
  selection = new SelectionModel<any>(true, []);

  //#region Taluka Api start
  getTalukaName(editFlag: any) {
    this.talukaArr = [];
    this.commonService.getAllTaluka().subscribe({
      next: (response: any) => {
        this.talukaArr.push(...response);
        editFlag == true ? (this.frmCitizen.controls['talukaId'].setValue(this.updatedObj?.talukaId), this.getVillageName(this.updatedObj?.talukaId, editFlag)) : '';
      },
      error: ((error: any) => { this.error.handelError(error.status) })

    })
  }

  //#endregion Taluka Api end


  //#region Village Api start
  getVillageName(talukaId: number, editFlag: any) {
    this.frmCitizen.controls['villageId'].setValue('');
    this.villageArr = [];
    if (talukaId != 0) {
      this.commonService.getVillageByTalukaId(talukaId).subscribe({
        next: (response: any) => {
          this.villageArr.push(...response);
          // this.villageArr.unshift({ "id": "", "village": "Select Village" });
          editFlag == true ? (this.frmCitizen.controls['villageId'].setValue(this.updatedObj?.villageId)) : this.frmCitizen.controls['villageId'].setValue('')
        },
        error: ((error: any) => { this.error.handelError(error.status) })
      })
    }
  }

  //#endregion Village Api end

  //#region Village Api start
  getVillageFilter(talukaId: number,) {
    this.filterVillageArry = [];
    if (talukaId != 0) {
      this.commonService.getVillageByTalukaId(talukaId).subscribe({
        next: (response: any) => {
          this.filterVillageArry.push(...response);
          this.filterVillageArry.unshift({ "id": 0, "village": "All Village" ,"m_Village": "सर्व गाव"});
          this.filterForm.controls['villageId'].setValue(0);
          this.filterData();
        },
        error: ((error: any) => { this.error.handelError(error.status) })
      })
    } else {
      this.filterVillageArry.unshift({ "id": 0, "village": "All Village" ,"m_Village": "सर्व गाव"});
      this.filterForm.controls['villageId'].setValue(0);
    }
  }

  //#endregion Village Api end


  //#region Bind table Fun start
  getData() {
    this.spinner.show()
    let formData = this.filterForm.value;
    this.apiService.setHttp('get', 'samadhan/user-registration/GetAllCitizen?TalukaId=' + formData.talukaId + '&VillageId=' + formData.villageId + '&Textsearch=' + formData.textsearch + '&pageno=' + this.pageNo + '&pagesize=' + this.pageSize, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          let dataSet = res.responseData.responseData1;
          this.dataSource = new MatTableDataSource(dataSet);
          this.totalPages = res.responseData.responseData2.pageCount;
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.dataSource = [];
          this.totalPages = 0;
        }
      },
      error: (error: any) => {
        this.dataSource = [];
        this.error.handelError(error.status);
        this.spinner.hide();

      },
    });
  }

  //#endregion Bind table Fun end


  //#region update fun start
  onUpdateCitizen() {
    if (this.frmCitizen.invalid) {
      return;
    }
    let formData = this.frmCitizen.value;
    let obj = {
      "id": this.isEdit == true ? this.updatedObj.id : 0,
      "name": formData.name,
      "mobileNo": formData.mobileNo,
      "emailId": formData.emailId,
      "talukaId": formData.talukaId,
      "villageId": formData.villageId,
      "modifiedBy": formData.modifiedBy,
      "modifiedDate": new Date()
    };

    let method = 'PUT';
    let url = 'UpdateCitizen';
    this.apiService.setHttp(
      method,
      'samadhan/user-registration/' + url,
      false,
      obj,
      false,
      'samadhanMiningService'
    );
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.highlightedRow = 0;
          this.getData();
          this.onCancelRecord();
          this.commonMethod.matSnackBar(res.statusMessage, 0);
        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
        }

      },
      error: (error: any) => {
        this.error.handelError(error.status);
        this.spinner.hide();
      },
    });
  }

  //#endregion update fun end


  //#region patchValue start
  editRecord(ele: any) {
    this.isdisable = true;
    this.highlightedRow = ele.id;
    this.isEdit = true;
    this.updatedObj = ele;
    this.frmCitizen.patchValue({
      name: this.updatedObj.name,
      emailId: this.updatedObj.emailId,
      mobileNo: this.updatedObj.mobileNo.trim(),
    });
    this.getTalukaName(this.isEdit);

  }
  //#endregion patchValue end

  //#region CancelRecord fun start
  onCancelRecord() {
    this.formDirective.resetForm();
    this.isEdit = false;
    this.isdisable = false;
    this.selection.clear();
  }

  //#endregion CancelRecord fun end


  //#region pagination fun start
  pageChanged(event: any) {
    this.pageNo = event.pageIndex + 1;
    this.getData();
    this.onCancelRecord();
    this.selection.clear();
  }

  //#endregion pagination fun end


  //#region clearFilter Fun start
  clearFilter(flag: any) {
    switch (flag) {
      case 'taluka':
        this.filterForm.controls['villageId'].setValue(0);
        this.filterForm.controls['textsearch'].setValue('');
        break;
      case 'village':
        this.filterForm.controls['textsearch'].setValue('');
        break;
      default:
    }
  }

  //#endregion clearFilter Fun end


  //#region delete fun start
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
        p1: this.langTypeName=='English' ? 'Are you sure you want to delete this record?' : 'तुमची खात्री आहे की तुम्ही हा रेकॉर्ड हटवू इच्छिता?',
        p2: '',
        cardTitle: this.langTypeName=='English' ? 'Delete' :'हटवा',
        successBtnText: this.langTypeName=='English' ? 'Delete' :'हटवा',
        dialogIcon: '',
        cancelBtnText: this.langTypeName=='English' ? 'Cancel' :'रद्द करा',
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
      'samadhan/user-registration/DeleteCitizen',
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

  //#endregion Delete fun end

  userBlockUnBlockModal(element: any, event: any) {
    this.highlightedRow = element.id;
    let Title: string, dialogText: string;
    // event.checked == true ? Title = 'Block User' : Title = 'Unblock User';
    // event.checked == true ? dialogText = 'Do you want to Block the user?' : dialogText = 'Do you want to Unblock the user?';
    event.checked == true ? (this.langTypeName=='English'? Title = 'Block User': Title ='वापरकर्त्याला ब्लॉक करा') : (this.langTypeName=='English'? Title = 'Unblock User': Title ='वापरकर्त्याला अनब्लॉक करा');
    event.checked == true ? (this.langTypeName=='English'? dialogText = 'Do you want to Block the user?' : dialogText='तुम्ही वापरकर्त्याला ब्लॉक करू इच्छिता?')  : (this.langTypeName=='English'? dialogText = 'Do you want to Unblock the user?' : dialogText='तुम्ही वापरकर्त्याला अनब्लॉक करू इच्छिता?');
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '400px',
      data: { p1: dialogText, p2: '', cardTitle: Title, successBtnText: (this.langTypeName=='English'? 'Yes' : 'होय'), dialogIcon: 'done_outline', cancelBtnText: (this.langTypeName=='English'? 'No':'नाही') },
      disableClose: this.apiService.disableCloseFlag,
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.highlightedRow = 0;
      res == 'Yes' ? this.userBlockUnBlock(element, event.checked) : element.isBlock === "False" || element.isBlock == null ? event.source.checked = false : event.source.checked = true;
      this.onCancelRecord();
    });
  }

  userBlockUnBlock(element: any, event: any) {
    let obj = {
      "id": element?.id,
      "isBlock": event == true ? true : false,
      "blockDate": new Date(),
      "blockBy": this.localStrorageData.getUserId(),
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

  //#region ngOnDestroy start
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  //#endregion ngOnDestroy end
}
