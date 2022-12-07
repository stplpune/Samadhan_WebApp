import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, NgZone, } from '@angular/core';
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
import { TranslateService } from '@ngx-translate/core';
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
  displayedColumns: string[] = ['srNo', 'departmentName', 'officeName', 'action'];
  dataSource: any;
  frmOffice!: FormGroup;
  filterForm!: FormGroup;
  totalRows: any;
  departmentArr = new Array();
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
  loggedUserTypeId:any;
  loggedUserDeptID:any;
  dropdownDisable:boolean = false;
  langTypeName: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public error: ErrorHandlerService,
    private spinner: NgxSpinnerService,
    public configService: ConfigService,
    public validation: FormsValidationService,
    public localStrorageData: WebStorageService,
    private webStorage: WebStorageService,
    public commonService: CommonApiService,
    public dialog: MatDialog,
    public commonMethod: CommonMethodService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    
    public translate: TranslateService
  ) { }


  ngOnInit(): void {
   this.loggedUserTypeId= this.localStrorageData.getLoggedInLocalstorageData().responseData?.userTypeId;
   this.loggedUserDeptID= this.localStrorageData.getLoggedInLocalstorageData().responseData?.deptId;
    this.createOfficeForm();
    this.filterform();
    this.getDepartmentName(this.localStrorageData.getUserId());
    if( this.loggedUserTypeId ==3 ||  this.loggedUserTypeId == 4){
      this.frmOffice.controls['deptId'].setValue(this.loggedUserDeptID);
      this.filterForm.controls['deptId'].setValue(this.loggedUserDeptID);
      this.dropdownDisable=true;
     }
    this.getData();
    this.mapApiLoader();

    this.webStorage.langNameOnChange.subscribe(message => {
      this.langTypeName = message;
     });
     console.log(this.langTypeName);
  }


  //#region createOfficeForm start
  createOfficeForm() {
    this.frmOffice = this.fb.group({
      deptId: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.pattern(this.validation.valName)]],
      m_OfficeName: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.pattern('^[^[ ]+|[ ][gm]+$')]],
      emailId: ['', [Validators.pattern(this.validation.valEmailId)],],
      contactPersonName: ['', [Validators.required, Validators.pattern(this.validation.valName)],],
      landlineNo: ['', [Validators.pattern, Validators.minLength(11), Validators.maxLength(11),],],
    });
  }

  //#region createOfficeForm end

  get f() {
    return this.frmOffice.controls;
  }

  //#region filterform start
  filterform() {
    this.filterForm = this.fb.group({
      deptId: ["0"],
      name: ['']
    })
  }

  //#region filterform end

  //#region Search start
  ngAfterViewInit() {
    let formData: any = this.filterForm.controls['name'].valueChanges;
    formData.pipe(filter(() => this.filterForm.valid),
      debounceTime(1000),
      distinctUntilChanged()).subscribe(() => {
        this.pageNo = 1;
        this.getData();
        this.onCancelRecord();
        this.totalRows > 10 && this.pageNo == 1 ? this.paginator?.firstPage() : '';
      });
  }

  //#region Search end
  selection = new SelectionModel<any>(true, []);

  //#region Department Api start
  getDepartmentName(id:number) {
    this.departmentArr = [];
    this.commonService.getAllDepartmentByUserId(id).subscribe({
      next: (response: any) => {
        this.departmentArr.push(...response);
        if(this.loggedUserTypeId == 3){       //  3 logged user userTypeId
          this.filterForm.controls['deptId'].setValue(this.loggedUserDeptID);
          this.dropdownDisable=true;
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }
//#region Department Api end

 //#region Bind Table Fun start
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
          this.pageNo == 1 ? this.paginator?.firstPage() : '';
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.dataSource = [];
          this.selection.clear();
          this.totalPages = 0;
          if (res.statusCode != 404) {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          }
        }
      },
      error: (error: any) => {
        this.dataSource = [];
        this.error.handelError(error.status);
        this.spinner.hide();

      },
    });
  }


  //#region Bind Table Fun end


  //#region Submit Fun start
  onSubmitOffice() {
    // this.spinner.show();
    if (this.frmOffice.invalid) {
      return;
    }
    let formData = this.frmOffice.value;
    let obj = {
      createdBy: this.webStorage.getUserId(),
      modifiedBy: this.webStorage.getUserId(),
      createdDate: new Date(),
      modifiedDate: new Date(),
      isDeleted: true,
      id: this.isEdit == true ? this.updatedObj.id : 0,
      deptId: formData.deptId,
      name: formData.name,
      m_OfficeName:formData.m_OfficeName,
      address: formData.address,
      emailId: formData.emailId,
      contactPersonName: formData.contactPersonName,
      landlineNo: formData.landlineNo,
    };

    let method = this.isEdit ? 'PUT' : 'POST';
    let url = this.isEdit ? 'UpdateOfficeDetails' : 'AddOfficeDetails';
    this.apiService.setHttp(method, 'samadhan/office/' + url, false, obj, false, 'samadhanMiningService');
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.highlightedRow = 0;
          // this.spinner.hide();
          method == 'PUT' ? this.getData() : this.pageNo = 1, this.getData();
          this.onCancelRecord();
          this.selection.clear();
          this.commonMethod.matSnackBar(res.statusMessage, 0);
        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
        }
        // this.spinner.hide();
      },
      error: (error: any) => {
        this.error.handelError(error.status);
        this.spinner.hide();
      },
    });
  }

  //#region Submit Fun end

  //#region Patch Value Fun start
  editRecord(ele: any) {
    this.highlightedRow = ele.id;
    this.isEdit = true;
    this.updatedObj = ele;
    this.frmOffice.patchValue({
      deptId: this.updatedObj.deptId,
      name: this.updatedObj.officeName,
      m_OfficeName:this.updatedObj.m_OfficeName,
      address: this.updatedObj.officeAddress,
      emailId: this.updatedObj.officeEmailId,
      contactPersonName: this.updatedObj.contactPersonName,
      landlineNo: this.updatedObj.landlineNo,
    });
  }

  //#region Patch Value Fun end


  //#region Pagination Fun start
  pageChanged(event: any) {
    this.pageNo = event.pageIndex + 1;
    this.getData();
    this.onCancelRecord();
    this.selection.clear();

  }

  //#region Pagination Fun end


  //#region Filter Fun start
  filterData() {
    this.pageNo = 1;
    this.getData();
    this.onCancelRecord();

  }

  //#region Filter Fun end

  //#region CAncleRecord Fun start
  onCancelRecord() {
    this.formDirective.resetForm();
    this.isEdit = false;
    this.highlightedRow = 0;
    this.frmOffice.controls['deptId'].setValue(this.loggedUserDeptID);
   this.dropdownDisable=true;
   this.selection.clear();
  }

  //#region CAncleRecord Fun end


  //#region Delete Fun start
  isAllSelected() {
    const numSelected = this.selection.selected.length;

    if (this.dataSource) {
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    } else {
      return false;
    }

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
    this.apiService.setHttp('DELETE', 'samadhan/office/Delete', false, delArray, false, 'samadhanMiningService');
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

  //#region mapApiLoader Fun start
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
  //#region mapApiLoader Fun end

  //#region ngOnDestroy start
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  //#region ngOnDestroy end




}

