import {AfterViewInit,Component,OnDestroy,OnInit,ViewChild,NgZone,}from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { MatPaginator } from '@angular/material/paginator';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { MapsAPILoader } from '@agm/core';
declare var google: any;
@Component({
  selector: 'app-office-master',
  templateUrl: './office-master.component.html',
  styleUrls: ['./office-master.component.css'],
})
export class OfficeMasterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('formDirective') formDirective!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('search') searchElementRef: any;
  // displayedColumns: string[] = ['srNo','departmentName','officeName','weight','delete','select',];
  displayedColumns: string[] = ['srNo','departmentName','officeName','action'];
  dataSource: any;
  frmOffice!: FormGroup;
  filterForm!:FormGroup;
  totalRows: any;
  departmentArr= new Array();
  officeArray = new Array();
  totalPages: any;
  pageNo = 1;
  pageSize = 10;
  isEdit: boolean = false;
  subscription!: Subscription;
  updatedObj: any;
  highlightedRow!: number;
  latitude: any;
  longitude: any;
  pinCode: any;
  geocoder: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public error: ErrorHandlerService,
    private spinner: NgxSpinnerService,
    public configService: ConfigService,
    public validation: FormsValidationService,
    public localStrorageData: WebStorageService,
    private webStorage:WebStorageService,
    public commonService: CommonApiService,
    public dialog: MatDialog,
    public commonMethod: CommonMethodService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) {}


  ngOnInit(): void {
    this.createOfficeForm();
    this.filterform();
    this.getDepartmentName();
    this.getData();
    this.mapApiLoader();
  }


//---------------------------------------------------------------------------Office Form----------------------------------------------------------------
  createOfficeForm() {
    this.frmOffice = this.fb.group({
      deptId: ['', [Validators.required]],
      name: ['',[Validators.required, Validators.pattern(this.validation.valName)]],
      address: ['',[Validators.required, Validators.pattern('^[^[ ]+|[ ][gm]+$')]],
      // latitude: ['', [Validators.required]],
      // longitude: ['', [Validators.required]],
      emailId: ['',[Validators.required, Validators.pattern(this.validation.valEmailId)],],
      contactPersonName: ['',[Validators.required, Validators.pattern(this.validation.valName)],],
      mobileNo: ['',[Validators.required,Validators.pattern(this.validation.valMobileNo),Validators.minLength(10),Validators.maxLength(10),],],
    });
  }

  get f() {
    return this.frmOffice.controls;
  }
  //-------------------------------------------------------------------------FilterFOrm--------------------------------------------------------------------------------------
   filterform() {
    this.filterForm = this.fb.group({
      deptId: [0],
      name: ['']
         })
       }
  //-------------------------------------------------------------------------AfterViewInit------------------------------------------------------------------
    ngAfterViewInit() {
    let formData: any = this.filterForm.controls['name'].valueChanges;
    formData.pipe(filter(() => this.filterForm.valid),
      debounceTime(0),
      distinctUntilChanged()).subscribe(() => {
        this.pageNo = 1;
        this.getData();
        this.totalRows > 10 && this.pageNo == 1 ? this.paginator?.firstPage() : '';
      });
    }
   selection = new SelectionModel<any>(true, []);

  //--------------------------------------------------------Department-------------------------------------------------------------------------------------------

  getDepartmentName(){
    this.departmentArr = [];
    this.commonService.getAllDepartment().subscribe({
      next: (response: any) => {
        this.departmentArr.push(...response);
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })

  }

  //-------------------------------------------------------------Dispaly Table-----------------------------------------------------------------------------
  getData() {
    this.spinner.show()
    let formData = this.filterForm.value;
    this.apiService.setHttp('get','samadhan/office/GetAll?pageno=' +this.pageNo+'&pagesize=' +this.pageSize+'&DeptId='+ formData.deptId +'&Name='+formData.name,false,false,false,'samadhanMiningService');
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
  onSubmitOffice() {
    // this.spinner.show();
    if (this.frmOffice.invalid) {
      return;
    }
    let formData = this.frmOffice.value;
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
          // this.spinner.hide();
          this.getData();
          this.onCancelRecord();
          this.selection.clear();
          this.commonMethod.checkDataType(res.statusMessage) == false? this.error.handelError(res.statusCode): this.commonMethod.matSnackBar(res.statusMessage, 0);
        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false? this.error.handelError(res.statusCode): this.commonMethod.matSnackBar(res.statusMessage, 1);
        }
        // this.spinner.hide();
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
      this.pageNo = event.pageIndex + 1;
      this.getData();
      this.onCancelRecord();
      this.selection.clear();

    }
//------------------------------------------------------------------------FIlterData------------------------------------------------------------------------
    filterData(){
      this.pageNo = 1;
      this.getData();
      this.onCancelRecord();

    }

   filterRecord() {
    this.getData();
  }
//----------------------------------------------------------------------------Cancle--------------------------------------------------------------------------------------
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
        this.onCancelRecord();
      } else {
        this.selection.clear();
        this.onCancelRecord();
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

  mapApiLoader() {

    this.mapsAPILoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.findAddressByCoordinates();
        });
      });
    });
  }

  findAddressByCoordinates() {
    this.geocoder.geocode(
      { location: { lat: this.latitude, lng: this.longitude, } },
      (results: any) => {
        results[0].address_components.forEach((element: any) => {
          this.pinCode = element.long_name;
        });
      });
      this.frmOffice.controls['address'].setValue(this.searchElementRef.nativeElement?.value);
  }
}

