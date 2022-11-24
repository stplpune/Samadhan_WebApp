import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { debounceTime, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { CommonApiService } from 'src/app/core/service/common-api.service';



@Component({
  selector: 'app-grievance-master',
  templateUrl: './grievance-master.component.html',
  styleUrls: ['./grievance-master.component.css']
})
export class GrievanceMasterComponent implements OnInit ,AfterViewInit, OnDestroy {
  @ViewChild('formDirective') formDirective!: NgForm;
  //  displayedColumns: string[] = [ 'srNo', 'departmentName', 'grievanceType', 'action','delete','select'];
  displayedColumns: string[] = [ 'srNo', 'departmentName', 'grievanceType', 'action'];
  dataSource :any;
  frmGrievance! : FormGroup;
  filterForm!:FormGroup;
  totalRows:any;
  griveanceArray=new Array();
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
    public error: ErrorHandlerService,
    private spinner: NgxSpinnerService,
    public validation: FormsValidationService,
    public localStrorageData: WebStorageService,
    public commonService: CommonApiService,
    private webStorage:WebStorageService,
    public commonMethod: CommonMethodService,) { }

  ngOnInit(): void {
    this.createGrievanceForm();
    this.filterMethod();
    this.getDepartmentName();
    this.getData();


  }
  get f() { return this.frmGrievance.controls };

//#region createGrievanceForm start
    createGrievanceForm(){
  this.frmGrievance = this.fb.group({
    deptId: ['', [Validators.required]],
    grievanceType:['',[Validators.required,Validators.pattern]]
  })
}

//#region createGrievanceForm end

//#region Search Fun start
ngAfterViewInit() {
let formData = this.filterForm.controls['grievanceType'].valueChanges;
formData.pipe(filter(() => this.filterForm.valid),
debounceTime(1000),
distinctUntilChanged()).subscribe(() => {
  this.pageNo = 1;
  this.getData();
  this.totalRows > 10 && this.pageNo == 1 ? this.paginator?.firstPage() : '';
})
}

//#region Search Fun end

//#region Filter Fun start
filterMethod(){
     this.filterForm = this.fb.group({
      deptId:[0],
      grievanceType:['']
  })
}

//#region Filter Fun end

  selection = new SelectionModel<any>(true, []);


//#region Bind table Fun start
  getData(){
  this.spinner.show();
  let formData = this.filterForm.value;
  this.apiService.setHttp('get', "api/Grievance/GetAll?Id=" +formData.deptId+'&GrievanceType='+ formData.grievanceType +'&pageno=' + this.pageNo +'&pagesize='+this.pageSize, false, false, false, 'samadhanMiningService');
  this.apiService.getHttp().subscribe({
    next: (res: any) => {
      if (res.statusCode == 200) {
        let dataSet = res.responseData;
        this.dataSource = new MatTableDataSource(dataSet);
        this.totalPages = res.responseData1.pageCount;
        this.pageNo == 1 ? this.paginator?.firstPage():'';
        this.spinner.hide();
      }else{
       this.spinner.hide();
        this.dataSource=[];
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

    //#region Bind table Fun end

//#region Department Api start
  getDepartmentName(){
    this.departmentArr = [];
    this.commonService.getAllDepartment().subscribe({
      next: (response: any) => {
        this.departmentArr.push(...response);
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })

  }

  //#region Department Api end

//#region Submit Form start
onSubmitGrievance(){
    // this.spinner.show();
    if (this.frmGrievance.invalid) {
      return;
    }
    let formData = this.frmGrievance.value;
    let obj = {
  "createdBy":  this.webStorage.getUserId(),
  "modifiedBy": this.webStorage.getUserId(),
  "createdDate": new Date(),
  "modifiedDate": new Date(),
  "isDeleted": true,
  "id": this.isEdit == true ? this.updatedObj.grievanceTypeId : 0,
  "deptId": formData.deptId,
  "name":formData.grievanceType,
    }

    let method = this.isEdit ? 'PUT' : 'POST';
    let url = this.isEdit ? "UpdateGrivance" : "AddGrivance";
    this.apiService.setHttp(method, "api/Grievance/" + url, false, obj, false, 'samadhanMiningService');
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.highlightedRow = 0;
          // this.spinner.hide();
          this.getData();
          this.onCancelRecord();
          this.selection.clear();
          this.commonMethod.matSnackBar(res.statusMessage, 0);
        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
        }
        // this.spinner.hide();
      },
      error: ((error: any) => { this.error.handelError(error.status); this.spinner.hide(); })
    })
  }

  //#region Submit Form end

//#region Patch Value fun start
 editRecord(data:any){
  this.highlightedRow = data.grievanceTypeId;
  this.isEdit = true;
  this.updatedObj = data;
  this.frmGrievance.patchValue({
    deptId:this.updatedObj?.deptId,
    grievanceType:this.updatedObj.grievanceType,
  });
 }

 //#region Patch Value fun end

//#region Pagination fun start
pageChanged(event: any) {
  this.pageNo = event.pageIndex + 1;
  this.getData();
  this.onCancelRecord();
  this.selection.clear();

}

//#region Pagination fun end

//#region CancleRecord Fun start
onCancelRecord() {
  this.formDirective.resetForm();
  this.isEdit = false;
}

//#region CancleRecord Fun end


//#region Filter Fun start
  filterData(){
    this.pageNo = 1;
    this.getData();
    this.onCancelRecord();

  }

  //#region Filter Fun end

//#region Delete Fun start
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
        id: data.grievanceTypeId,
        deletedBy: 0,
        modifiedDate: new Date(),
      };
      delArray.push(obj);
    });
  }
  this.apiService.setHttp(
    'DELETE',
    'api/Grievance/DeleteGrievance',
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

//#region Delete Fun end

//#region ngOnDestroy start
ngOnDestroy() {
  this.subscription?.unsubscribe();
}

//#region ngOnDestroy end
  }


