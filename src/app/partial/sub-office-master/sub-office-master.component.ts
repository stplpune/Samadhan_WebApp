import { SelectionModel } from '@angular/cdk/collections';
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/service/api.service';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { ConfirmationComponent } from '../dialogs/confirmation/confirmation.component';
import { Subscription, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-sub-office-master',
  templateUrl: './sub-office-master.component.html',
  styleUrls: ['./sub-office-master.component.css']
})
export class SubOfficeMasterComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['srNo', 'departmentName', 'officeName', 'SubOfficeName', 'action'];
  dataSource: any;
  filterSubOfficeForm!: FormGroup;
  addUpdateForm!: FormGroup;
  localData: any;
  departmentArr = new Array();
  officeArray = new Array();
  dropdownDisable: boolean = false;
  langTypeName: any;
  pageNo = 1;
  pageSize = 10;
  totalPages: any;
  highlightedRow!: number;
  totalRows: any;
  geocoder: any;
  latitude: any;
  longitude: any;
  pinCode: any;
  subscription!: Subscription;
  editObj : any;
  isEdit: boolean = false ;
  placeChangeFlag: boolean = false;
  // save
  departmentArray = new Array();
  officeArrayFormDrp = new Array();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('search') searchElementRef: any;
  @ViewChild('formDirective') formDirective!: NgForm;


  constructor(private fb: FormBuilder,
    public webStorage: WebStorageService,
    public commonService: CommonApiService,
    private commonMethod: CommonMethodService,
    public errorService: ErrorHandlerService,
    public validation: FormsValidationService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,

  ) { }

  ngOnInit(): void {
    // this.loggedUserDeptID= this.webStorage.getLoggedInLocalstorageData().responseData?.deptId;
    // this.loggedUserTypeId= this.webStorage.getLoggedInLocalstorageData().responseData?.userTypeId;
    this.localData = this.webStorage.getLoggedInLocalstorageData().responseData;
    console.log("this.localData", this.localData);
    
    this.defaultAddEditForm();
    this.defaultFilterForm();
    this.getDepartments(this.webStorage.getUserId());
    this.getDeptDrpforSaveForm(this.webStorage.getUserId());

    // if (this.localData?.userTypeId == 3 || this.localData?.userTypeId == 4) {
    //   this.addUpdateForm.controls['deptId'].setValue(this.localData?.deptId);
    //   this.addUpdateForm.controls['officeId'].setValue(this.localData?.officeId);
    //   this.dropdownDisable = true;
    // }
    this.webStorage.langNameOnChange.subscribe(message => {
      this.langTypeName = message;
    });
    this.searchSubOffData();
    this.mapApiLoader();

  }

  defaultFilterForm() {
    this.filterSubOfficeForm = this.fb.group({
      deptId: [(this.localData?.userTypeId == 3 || this.localData?.userTypeId == 4)? this.localData?.deptId : '0'],
      officeId: [(this.localData?.userTypeId == 3 || this.localData?.userTypeId == 4)? this.localData?.officeId: '0' ],
      subOfficeName: ['']
    });
  }

  defaultAddEditForm() {
    this.addUpdateForm = this.fb.group({
      "createdBy": this.isEdit ?  this.editObj.createdBy : this.webStorage.getUserId(),
      "modifiedBy": this.isEdit ?  this.editObj.modifiedBy : this.webStorage.getUserId(),
      "createdDate": this.isEdit ?  this.editObj.createdDate : new Date(),
      "modifiedDate": this.isEdit ?  this.editObj.modifiedDate : new Date(),
      "isDeleted": this.isEdit ?  this.editObj.isDeleted :  true,
      "id": this.isEdit ?  this.editObj.id : 0,
      "deptId": [this.isEdit ?  this.editObj.deptId : '', [Validators.required]],
      "officeId": [this.isEdit ?  this.editObj.officeId : '', [Validators.required]],
      "subOfficeName": [this.isEdit ?  this.editObj.subOfficeName : '', [Validators.required, Validators.pattern(this.validation.valUserName) ]],
      "address": [this.isEdit ?  this.editObj.officeAddress : '', [Validators.required, Validators.pattern('^[^[ ]+|[ ][gm]+$')]],
      "latitude": [this.isEdit ?  this.editObj.latitude : ''],
      "longitude": [this.isEdit ?  this.editObj.longitude : ''],
      "emailId": [this.isEdit ?  this.editObj.officeEmailId : '',[ Validators.pattern(this.validation.valEmailId)]],
      "contactPersonName": [this.isEdit ?  this.editObj.contactPersonName : '', [Validators.required, Validators.pattern(this.validation.valName)]],
      "landlineNo": [this.isEdit ?  this.editObj.landlineNo : '', [Validators.pattern, Validators.minLength(11), Validators.maxLength(11),]],
      "m_SubOfficeName": [this.isEdit ?  this.editObj.m_SubOfficeName : '', [Validators.required, Validators.pattern(this.validation.marathi)]],
    });
  }

  get f() {
    return this.addUpdateForm.controls;
  }

  selection = new SelectionModel<any>(true, []);

  // get dept for filters
  getDepartments(userId: number) {
    this.departmentArr = [];
    this.commonService.getAllDepartmentByUserId(userId).subscribe({
      next: (response: any) => {
        this.departmentArr.push(...response);
        if (this.localData?.userTypeId == 3 || this.localData?.userTypeId == 4) {       //  3 logged user userTypeId
          this.filterSubOfficeForm.controls['deptId'].setValue(this.localData?.deptId);          
          this.getOffices(this.filterSubOfficeForm.value.deptId);
          this.dropdownDisable = true;
        }
      },
      error: ((error: any) => { this.errorService.handelError(error.status) })
    });
  }

  // get filter offices
  getOffices(deptId: number) {
    
    if (deptId == 0) {
      return;
    }
    this.officeArray = [];
    this.commonService.getOfficeByDeptId(deptId).subscribe({
      next: (response: any) => {
        this.officeArray.push(...response);
        if (this.localData?.userTypeId == 4) {
          this.filterSubOfficeForm.controls['officeId'].setValue(this.localData?.officeId);
          this.dropdownDisable = true;
          console.log("this.filterSubOfficeForm", this.filterSubOfficeForm.value.officeId);
          
        }
      },
      error: ((error: any) => { this.errorService.handelError(error.status) })
    });
  }

  //by suboffice Search text
  ngAfterViewInit() {
    let formData: any = this.filterSubOfficeForm.controls['subOfficeName'].valueChanges;
    formData.pipe(filter(() => this.filterSubOfficeForm.valid),
      debounceTime(1000),
      distinctUntilChanged()).subscribe(() => {
        this.pageNo = 1;
        this.searchSubOffData();
        this.onCancelRecord();
        this.totalRows > 10 && this.pageNo == 1 ? this.paginator?.firstPage() : '';
      });
  }

  pageChanged(event: any) {
    this.pageNo = event.pageIndex + 1;
    this.searchSubOffData();
    this.onCancelRecord();
    this.selection.clear();
  }


  filterData() {
    this.pageNo = 1;
    this.searchSubOffData();
    this.onCancelRecord();
  }
  // getAll subOffice data 
  searchSubOffData() {
    this.spinner.show();
    let formData = this.filterSubOfficeForm.value;
    this.apiService.setHttp('get', 'samadhan/SubOffice/GetAll?pageno=' + this.pageNo + '&pagesize=' + this.pageSize + '&DeptId=' + formData.deptId + '&OfficeId=' + formData.officeId + '&Name=' + formData.subOfficeName, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.dataSource = new MatTableDataSource(res.responseData);
          this.totalPages = res.responseData1.pageCount;
          this.pageNo == 1 ? this.paginator?.firstPage() : '';
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.dataSource = [];
          // this.selection.clear();
          this.totalPages = 0;
          if (res.statusCode != 404) {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          }
        }
      },
      error: (error: any) => {
        this.dataSource = [];
        this.errorService.handelError(error.status);
        this.spinner.hide();
      },
    });


  }

  editSubOffice(obj: any) {
    this.highlightedRow = obj.id;
    this.editObj = obj;
    this.isEdit = true;
    // this.defaultAddEditForm();
    this.addUpdateForm.patchValue({
      // "deptId":  this.editObj.deptId,
      // "officeId": this.editObj.officeId,
      "subOfficeName": this.editObj.subOfficeName ,
      "address": this.editObj.officeAddress ,
      "latitude": this.editObj.latitude ,
      "longitude": this.editObj.longitude,
      "emailId": this.editObj.officeEmailId,
      "contactPersonName": this.editObj.contactPersonName,
      "landlineNo": this.editObj.landlineNo ,
      "m_SubOfficeName": this.editObj.m_SubOfficeName ,
    });

    this.getDeptDrpforSaveForm(this.webStorage.getUserId());
     if (this.localData?.userTypeId == 3 || this.localData?.userTypeId == 4) {
      this.addUpdateForm.controls['deptId'].setValue(this.localData?.deptId);
      this.addUpdateForm.controls['officeId'].setValue(this.localData?.officeId);
      this.dropdownDisable = true;
    }
  }

  //select unselect Checkbox
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row: any) => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    if (this.dataSource) {
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    } else {
      return false;
    }
  }


  deleteData() {
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
        this.deleteSubOffice();
        this.onCancelRecord();
      } else {
        this.selection.clear();
        this.onCancelRecord();
      }
    });
  }

  deleteSubOffice() {
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
    this.apiService.setHttp('DELETE', 'samadhan/SubOffice/Delete', false, delArray, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe(
      {
        next: (res: any) => {
          if (res.statusCode === '200') {
            this.highlightedRow = 0;
            this.searchSubOffData();
            this.commonMethod.matSnackBar(res.statusMessage, 0);
            this.selection.clear();
          } else {
            if (res.statusCode != '404') {
              this.errorService.handelError(res.statusMessage);
            }
          }
        },
      },
      (error: any) => {
        this.spinner.hide();
        this.errorService.handelError(error.status);
      }
    );
    this.onCancelRecord();
  }

  onCancelRecord() {
    this.formDirective.resetForm();
    this.isEdit = false;
    this.highlightedRow = 0;
    // if (this.localData?.userTypeId == 3) {       //  3 logged user userTypeId
    //   this.addUpdateForm.controls['deptId'].setValue(this.localData?.deptId);
    //   this.dropdownDisable = true;
    // }
    if (this.localData?.userTypeId == 3 || this.localData?.userTypeId == 4) {
      this.addUpdateForm.controls['deptId'].setValue(this.localData?.deptId);
      this.addUpdateForm.controls['officeId'].setValue(this.localData?.officeId);
      this.dropdownDisable = true;
    }

    this.selection.clear();
  }

  clearFilter(flag: string) {
    switch (flag) {
      case 'dept':
        this.filterSubOfficeForm.controls['officeId'].setValue('0');
        this.filterSubOfficeForm.controls['subOfficeName'].setValue('');
        break;
      case 'office':
        this.filterSubOfficeForm.controls['subOfficeName'].setValue('');
        break;
      default:
    }
  }

  clearForm(flag: string){
    switch(flag){
      case 'dept':
        this.addUpdateForm.controls['officeId'].setValue('');
    }
  }

  // getdeptfor save
  getDeptDrpforSaveForm(userId: number){
    this.departmentArray = [];
    this.commonService.getAllDepartmentByUserId(userId).subscribe({
      next: (response: any) => {
        this.departmentArray.push(...response);
        if( this.localData?.userTypeId == 3 || this.localData?.userTypeId == 4){
          // this.filterFrm.controls['deptId'].setValue(this.loggedUserDeptID);
          this.addUpdateForm.controls['deptId'].setValue(this.localData?.deptId);
          this.getOfficeDrpForSave(this.addUpdateForm.value.deptId);
          this.dropdownDisable=true;
         }
         else{
          this.isEdit ? (this.addUpdateForm.controls['deptId'].setValue(this.editObj?.deptId), this.getOfficeDrpForSave(this.addUpdateForm.value.deptId)): ''

         }
        
      },
      error: ((error: any) => { this.errorService.handelError(error.status) })
    })
  }

  getOfficeDrpForSave(deptId: number){
    if (deptId == 0) {
      return;
    }
    this.officeArrayFormDrp = [];
    this.commonService.getOfficeByDeptId(deptId).subscribe({
      next: (response: any) => {
        this.officeArrayFormDrp.push(...response);
        if (this.localData?.userTypeId == 4) {
          this.addUpdateForm.controls['officeId'].setValue(this.localData?.officeId);
          this.dropdownDisable = true;
        }
        else{
          this.isEdit ? this.addUpdateForm.controls['officeId'].setValue(this.editObj?.officeId): ''

        }
      },
      error: ((error: any) => { this.errorService.handelError(error.status) })
    });

  }

  mapApiLoader(){
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
          console.log("place chenges");
          this.placeChangeFlag = true;
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
    this.addUpdateForm.controls['address'].setValue(this.searchElementRef.nativeElement?.value);
  }

  submitForm(){
    if(this.addUpdateForm.invalid){
      return
    }else{
      let formData = this.addUpdateForm.value;
      // formData.latitude = (this.isEdit && !this.placeChangeFlag)  ? this.editObj.latitude : this.latitude.toString();
      // formData.longitude = (this.isEdit && !this.placeChangeFlag) ? this.editObj.longitude : this.longitude.toString();
      let formObj = {
        "createdBy": this.webStorage.getUserId(),
        "modifiedBy": this.webStorage.getUserId(),
        "createdDate": new Date(),
        "modifiedDate": new Date(),
        "isDeleted": true,
        "id": this.isEdit ? this.editObj.id :  0,
        "deptId": formData.deptId ,
        "officeId": formData.officeId,
        "subOfficeName": formData.subOfficeName,
        "address": formData.address,
        "latitude": (this.isEdit && !this.placeChangeFlag)  ? this.editObj.latitude : this.latitude.toString(),
        "longitude": (this.isEdit && !this.placeChangeFlag) ? this.editObj.longitude : this.longitude.toString(),
        "emailId": formData.emailId,
        "contactPersonName": formData.contactPersonName,
        "landlineNo": formData.landlineNo,
        "m_SubOfficeName": formData.m_SubOfficeName
      }
      let url = this.isEdit ? 'UpdateOfficeDetails' : 'AddSubOfficeDetails';
      let method = this.isEdit ? 'PUT': 'POST';
      this.apiService.setHttp(method, 'samadhan/SubOffice/' + url, false, formObj, false, 'samadhanMiningService');
      this.subscription = this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == 200) {
            this.highlightedRow = 0;
            // this.spinner.hide();
            method == 'PUT' ? this.searchSubOffData() : this.pageNo = 1, this.searchSubOffData();
            this.onCancelRecord();
            this.selection.clear();
            this.commonMethod.matSnackBar(res.statusMessage, 0);
          } else {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          }
          // this.spinner.hide();
        },
        error: (error: any) => {
          this.errorService.handelError(error.status);
          this.spinner.hide();
        },
      });
    }
  }


  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }


}
