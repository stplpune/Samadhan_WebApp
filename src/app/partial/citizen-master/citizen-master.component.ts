import { Component, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
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


@Component({
  selector: 'app-citizen-master',
  templateUrl: './citizen-master.component.html',
  styleUrls: ['./citizen-master.component.css']
})
export class CitizenMasterComponent implements OnInit {
  @ViewChild('formDirective') formDirective!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // displayedColumns: string[] = [ 'srno', 'name', 'mobileNo','emailId', 'taluka','village','action','delete','select'];
  displayedColumns: string[] = [ 'srno', 'name', 'mobileNo','emailId', 'taluka','village','action'];
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
  talukaArr = new Array();
  villageArr = new Array ();
  updatedObj: any;
  changevillFlag:boolean=false;
  isdisable=false;

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
    public commonMethod: CommonMethodService
  ) { }

  ngOnInit(): void {
    this.createCitizenForm();
    this.getTalukaName(false);
    this.getData();
  }

//----------------------------------------------------------------FormStart---------------------------------------------------------------------------------------
  createCitizenForm(){
    this.frmCitizen = this.fb.group({
     name :['',[Validators.required, Validators.pattern(this.validation.valName)],],
     mobileNo :['',[Validators.required,Validators.pattern(this.validation.valMobileNo),Validators.minLength(10),Validators.maxLength(10),],],
     emailId :['',[Validators.required, Validators.pattern(this.validation.valEmailId)],],
     talukaId :['',[Validators.required]],
     villageId :['',[Validators.required]]
    });

    this.filterForm = this.fb.group({
      talukaId  : [0],
      villageId : [0],
      textsearch:[''],
    })
  }

  get f() {
    return this.frmCitizen.controls;
  }

//-------------------------------------------------------------------------AfterViewInit------------------------------------------------------------------
  ngAfterViewInit() {
    let formData: any = this.filterForm.controls['textsearch'].valueChanges;
    formData.pipe(filter(() => this.filterForm.valid),
      debounceTime(1000),
      distinctUntilChanged()).subscribe(() => {
        this.pageNo = 1;
        this.getData();
        this.totalRows > 10 && this.pageNo == 1 ? this.paginator?.firstPage() : '';
      });
    }
//---------------------------------------------------------------------------Filter-------------------------------------------------------------------------
  filterData(){
    this.pageNo = 1;
    this.getData();
    this.onCancelRecord();
  }

 filterRecord() {
  this.getData();
}
  selection = new SelectionModel<any>(true, []);
//----------------------------------------------------------------------------Taluka-------------------------------------------------------------------------------------------
getTalukaName(editFlag:any ) {
    this.talukaArr = [];
    this.commonService.getAllTaluka().subscribe({
      next: (response: any) => {
        this.talukaArr.push(...response);
        editFlag == true ? (this.frmCitizen.controls['talukaId'].setValue(this.updatedObj?.talukaId), this.getVillageName(this.updatedObj?.talukaId, editFlag )) : '';
      },
      error: ((error: any) => { this.error.handelError(error.status) })

    })
}

//----------------------------------------------------------------------------Village---------------------------------------------------------------------------------------------
getVillageName(talukaId:number, editFlag:any) {

  this.frmCitizen.controls['villageId'].setValue('');
  console.log(this.frmCitizen.controls);
  this.villageArr = [];
  if(talukaId !=0){
    this.commonService.getVillageByTalukaId(talukaId).subscribe({
      next: (response: any) => {
        this.villageArr.push(...response);
        editFlag == true ? (this.frmCitizen.controls['villageId'].setValue(this.updatedObj?.villageId)) : ''
      },
      error: ((error: any) => { this.error.handelError(error.status) })

    })

  }

}

//---------------------------------------------------------------------------Dispaly Table-----------------------------------------------------------------------------
getData() {
this.spinner.show()
let formData = this.filterForm.value;
this.apiService.setHttp('get','samadhan/user-registration/GetAllCitizen?TalukaId='+formData.talukaId+'&VillageId='+formData.villageId+'&Textsearch='+formData.textsearch+'&pageno='+this.pageNo+'&pagesize='+this.pageSize,false,false,false,'samadhanMiningService');
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
});
}
//-----------------------------------------------------------------------Submit----------------------------------------------------------------------------------------------------
onUpdateCitizen() {
if (this.frmCitizen.invalid) {
  return;
}
let formData = this.frmCitizen.value;
let obj = {
  "id": this.isEdit == true ? this.updatedObj.id : 0,
  "name" : formData.name,
  "mobileNo": formData.mobileNo,
  "emailId": formData.emailId,
  "talukaId": formData.talukaId,
  "villageId": formData.villageId,
  "modifiedBy": formData.modifiedBy,
  "modifiedDate": new Date()
};

let method = this.isEdit ? 'PUT':'';
let url = this.isEdit ? 'UpdateCitizen' : '';
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
      this.selection.clear();
      this.commonMethod.checkDataType(res.statusMessage) == false? this.error.handelError(res.statusCode): this.commonMethod.matSnackBar(res.statusMessage, 0);
    } else {
      this.commonMethod.checkDataType(res.statusMessage) == false? this.error.handelError(res.statusCode): this.commonMethod.matSnackBar(res.statusMessage, 1);
    }

  },
  error: (error: any) => {
    this.error.handelError(error.status);
    this.spinner.hide();
  },
});
}
//----------------------------------------------------------------------------Edit---------------------------------------------------------------------------------
editRecord(ele: any) {
this.isdisable = true;
this.highlightedRow = ele.id;
this.isEdit = true;
this.updatedObj = ele;
this.frmCitizen.patchValue({
  name: this.updatedObj.name,
  emailId: this.updatedObj.emailId,
  mobileNo: this.updatedObj.mobileNo,
});
this.getTalukaName(this.isEdit);

}
//-------------------------------------------------------------------------CancleRecord-----------------------------------------------------------------------
onCancelRecord() {
  this.formDirective.resetForm();
  this.isEdit = false;
  this.isdisable= false;
}

//-------------------------------------------------------------------------Pagination-------------------------------------------------------------------------------
pageChanged(event: any){
  this.pageNo = event.pageIndex + 1;
  this.getData();
  this.onCancelRecord();
  this.selection.clear();
}

//---------------------------------------------------------------------------Clear---------------------------------------------------------------------------------
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
