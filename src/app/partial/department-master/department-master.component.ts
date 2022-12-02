
import {Component,OnDestroy,OnInit,ViewChild} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
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
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-department-master',
  templateUrl: './department-master.component.html',
  styleUrls: ['./department-master.component.css'],
})
export class DepartmentMasterComponent implements OnInit, OnDestroy {
  @ViewChild('formDirective') formDirective!: NgForm;
  @ViewChild('paginator') paginator!: MatPaginator;
// displayedColumns: string[] = ['srNo','departmentName','weight','delete','select',];
  displayedColumns: string[] = ['srNo','departmentName','action'];
  dataSource: any;
  frmDepartment!: FormGroup;
  filterForm!: FormGroup;
  isEdit: boolean = false;
  totalPages: any;
  pageNo = 1;
  subscription!: Subscription;
  updatedObj: any;
  highlightedRow!: number;
  departmentArr: any;
  selectedLang: any;
  loggedUserTypeId:any;
  loggedUserDeptID:any;
  dropdownDisable:boolean=false;

  constructor(
    private fb: FormBuilder,
    public configService: ConfigService,
    private webStorage: WebStorageService,
    public dialog: MatDialog,
    private apiService: ApiService,
    public error: ErrorHandlerService,
    private spinner: NgxSpinnerService,
    public validation: FormsValidationService,
    public commonMethod: CommonMethodService,
    public commonService: CommonApiService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loggedUserTypeId= this.webStorage.getLoggedInLocalstorageData().responseData?.userTypeId;
    this.loggedUserDeptID= this.webStorage.getLoggedInLocalstorageData().responseData?.deptId;
    this.createDepartmentForm();
    this.getDepartmentName(this.webStorage.getUserId());
    if( this.loggedUserTypeId ==3){
      // this.frmDepartment.controls['deptId'].setValue(this.loggedUserDeptID);
      this.filterForm.controls['deptId'].setValue(this.loggedUserDeptID);
     }
    this.getData();
    this.selectedLang = sessionStorage.getItem('language')
    this.translateLanguageTo(this.selectedLang);
  }

  translateLanguageTo(lang: any) {
    this.selectedLang = lang;
    sessionStorage.setItem('language', lang);
    this.translate.use(lang);
  }

//#region createDepartmentForm start
  createDepartmentForm() {
    this.frmDepartment = this.fb.group({
      departmentName: ['',[Validators.required, Validators.pattern(this.validation.valName)],],
      m_DepartmentName: ['', [Validators.required]],
    });

    this.filterForm = this.fb.group({
      deptId: ['0'],
    });
  }

//#endregion


  get f() {
    return this.frmDepartment.controls;
  }


  selection = new SelectionModel<any>(true, []);

 //#region Department Bind Fun start
  getDepartmentName(id:number) {
    this.departmentArr = [];
    this.commonService.getAllDepartmentByUserId(id).subscribe({
      next: (response: any) => {
        this.departmentArr.push(...response);
        if( this.loggedUserTypeId ==3){       //  logged user userTypeId
          this.filterForm.controls['deptId'].setValue(this.loggedUserDeptID);
          this.frmDepartment.controls['deptId'].setValue(this.loggedUserDeptID);
          this.dropdownDisable=true;
        }        
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
}

//#endregion Department Bind Fun end


 //#region Table Bind Fun start
 getData() {
     this.spinner.show();
     this.onCancelRecord();
    let formData = this.filterForm.value;
    this.apiService.setHttp('get','samdhan/Department/GetAllDepartments?Id=' +formData.deptId +'&pageno=' +this.pageNo +'&pagesize=' +this.configService.pageSize,false,false,false,'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          let dataSet = res.responseData;
          this.dataSource = new MatTableDataSource(dataSet);
          this.totalPages = res.responseData1.pageCount;
          this.pageNo == 1 ? this.paginator?.firstPage() : '';
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.dataSource = [];
          this.totalPages = 0;
        }

      },  error: (error: any) => {
        this.dataSource = [];
        this.error.handelError(error.status);
        this.spinner.hide();

      },
    });
  }

 //#endregion


 //#region Submit Fun start
 onSubmitDepartment() {
    this.spinner.show();
    if (this.frmDepartment.invalid) {
      this.spinner.hide();
      return;
    }
    let formData = this.frmDepartment.value;
    let obj = {
      createdBy: this.webStorage.getUserId(),
      modifiedBy: this.webStorage.getUserId(),
      createdDate: new Date(),
      modifiedDate: new Date(),
      isDeleted: false,
      id: this.isEdit == true ? this.updatedObj.id : 0,
      departmentName: formData.departmentName,
      m_DepartmentName: formData.m_DepartmentName
    };
    let method = this.isEdit ? 'PUT' : 'POST';
    let url = this.isEdit ? 'UpdateDepartment' : 'AddDepartment';
    this.apiService.setHttp(method,'samdhan/Department/' + url,false,obj,false,'samadhanMiningService');
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.spinner.hide();
          this.getData();
          this.commonMethod.matSnackBar(res.statusMessage, 0);
        } else {
          !this.commonMethod.checkDataType(res.statusMessage) ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
        }
        this.spinner.hide();
      },
      error: (error: any) => {
        this.error.handelError(error.status);
        this.spinner.hide();

      },
    });
  }

//#endregion

 //#region Edit Fun start
 editRecord(data: any) {
    this.highlightedRow = data.id;
    this.isEdit = true;
    this.updatedObj = data;
    this.frmDepartment.controls['departmentName'].setValue(this.updatedObj.departmentName);
    this.frmDepartment.controls['m_DepartmentName'].setValue(this.updatedObj.m_DepartmentName);
  }

//#endregion

 //#region Pagination Fun start
   pageChanged(event: any) {
    this.pageNo = event.pageIndex + 1;
    this.getData();
  }
//#endregion

 //#region CancleRecord Fun start
   onCancelRecord() {
    this.formDirective?.resetForm();
    this.isEdit = false;
    this.highlightedRow = 0;
    this.selection.clear();
  }
//#endregion CancleRecord Fun end

  //#region Filter Fun start
  filterData() {
    this.pageNo = 1;
    this.getData();
  }

//#endregion Filter Fun end

isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row: any) => this.selection.select(row));
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
        inputType:false
      },
      disableClose: this.apiService.disableCloseFlag,
    });
    dialog.afterClosed().subscribe((res) => {;
      if (res == 'Yes') {
        this.deleteUser();
        this.onCancelRecord();
      } else {
        this.onCancelRecord();
      }
    });
  }

  deleteUser() {

    let selDelArray = this.selection.selected;
    let delArray = new Array();
    let userId = this.webStorage.getUserId();
    if (selDelArray.length > 0) {
      selDelArray.find((data: any) => {
        let obj = {
          id: data.id,
          deletedBy: userId,
          modifiedDate: new Date(),
        };
        delArray.push(obj);
      });
    }
    this.apiService.setHttp(
      'DELETE',
      'samdhan/Department/DeleteDepartment',
      false,
      delArray,
      false,
      'samadhanMiningService'
    );
    this.apiService.getHttp().subscribe(
      {
        next: (res: any) => {
          if (res.statusCode == '200') {
            this.highlightedRow = 0;
            this.getData();
            this.commonMethod.matSnackBar(res.statusMessage, 0);
            this.selection.clear();
          } else {
            this.commonMethod.checkDataType(res.statusMessage) == false
            ? this.error.handelError(res.statusCode)
            : this.commonMethod.matSnackBar(res.statusMessage, 1);
            this.selection.clear();
            this.getData();
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

