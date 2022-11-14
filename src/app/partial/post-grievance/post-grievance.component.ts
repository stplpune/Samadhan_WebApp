import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { ApiService } from 'src/app/core/service/api.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from 'src/app/configs/config.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { FileUploadService } from 'src/app/core/service/file-upload.service';
import { ConfirmationComponent } from '../dialogs/confirmation/confirmation.component';
// import { FileUploadService } from 'src/app/core/service/file-upload.service';
@Component({
  selector: 'app-post-grievance',
  templateUrl: './post-grievance.component.html',
  styleUrls: ['./post-grievance.component.css']
})
export class PostGrievanceComponent implements OnInit {

  displayedColumns: string[] = ['srno','grievanceId', 'name', 'taluka',  'department',  'status', 'action', 'button', 'select'];
  registerBy = [{ value: 1, type: 'Self' }, { value: 0, type: 'Others' }];
  selection = new SelectionModel<Element>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;

  stateArray: any[] = [];
  filterFrm!: FormGroup;
  postGrievanceForm!: FormGroup;
  districtArray = new Array();
  talukaArray = new Array();
  villageArray = new Array();
  departmentArray = new Array();
  officeArray = new Array();
  statusArray = new Array();
  natureOfGrievance = new Array();
  postGrivanceData = new Array();
  totalRows: number = 0;
  dataSource: any;
  pageNumber: number = 1;
  highlightedRow!:number;
  isSelfGrievance = new FormControl(1);
  grievanceImageArray :any[]=[];
  subscription!: Subscription;
  ispatch:boolean=false;
  updatedObj:any;
  documentUrlUploaed:any;
  @ViewChild('formDirective')
  private formDirective!: NgForm;


  constructor(public commonMethod: CommonMethodService,
    public apiService: ApiService,
    public validation: FormsValidationService,
    public error: ErrorHandlerService,
    public dialog: MatDialog,
    public configService: ConfigService,
    public commonApi: CommonApiService,
    public localStrorageData: WebStorageService,
    private fb: FormBuilder,
    private uploadFilesService:FileUploadService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.filterForm();
    this.defaultForm();
    this.getDistrict();
    this.getTaluka(1);
    this.getStatus();
    this.getDepartment();
    this.getGrievance();
    this.bindTable();
  }

  get f() { return this.postGrievanceForm.controls;}

  defaultForm() {
    this.postGrievanceForm = this.fb.group({
      otherCitizenName: [''],
      otherCitizenMobileNo: [''],
      otherCitizenAddress: [''],
      districtId: ['', [Validators.required]],
      talukaId: ['', [Validators.required]],
      villageId: ['', [Validators.required]],
      deptId: ['', [Validators.required]],
      officeId: ['', [Validators.required]],
      natureGrievanceId: ['', [Validators.required]],
      grievanceDescription: ['', [Validators.required]]
    })
  }

  filterForm() {
    this.filterFrm = this.fb.group({
      talukaId: [0],
      // villageId: [0],
      deptId: [0],
      // officeId: [0],
      statusId: [0],
      textSearch: ['']
    })
  }

  ngAfterViewInit() {
    let formValue: any = this.filterFrm.controls['textSearch'].valueChanges;
    formValue.pipe(filter(() => this.filterFrm.valid),
      debounceTime(1000),
      distinctUntilChanged()).subscribe(() => {
        this.pageNumber = 1;
        this.bindTable();
        this.totalRows > 10 && this.pageNumber == 1 ? this.paginator?.firstPage() : '';
      });
  }

  filterData() {
    this.pageNumber = 1;
    this.bindTable();
  }

  pageChanged(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.bindTable();
    this.isAllSelected();
    this.masterToggle();
  }

  getState() {
    this.stateArray = [];
    this.commonApi.getAllState().subscribe({
      next: (response: any) => {
        this.stateArray.push({ 'value': 0, 'text': 'Select State' }, ...response);
        console.log(this.stateArray);
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }

  getDistrict() {
    this.districtArray = [];
    // const id = this.userFrm.value.stateId;
    this.commonApi.getAllDistrict().subscribe({
      next: (response: any) => {
        this.districtArray.push(...response);
        this.districtArray.length == 1 ? this.postGrievanceForm.controls['districtId'].setValue(this.districtArray[0].id) : '';
        // this.getTaluka(1);
        this.ispatch==true ? (this.postGrievanceForm.controls['districtId'].setValue(this.updatedObj?.districtId),this.getTaluka(this.updatedObj?.districtId)): '';
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }

  getTaluka(distId: number) {
    this.talukaArray = [];
    this.commonApi.getTalukabyDistId(distId).subscribe({
      next: (response: any) => {
        this.talukaArray.push(...response);
        this.ispatch==true ? (this.postGrievanceForm.controls['talukaId'].setValue(this.updatedObj?.talukaId),this.getVillage(this.updatedObj?.talukaId)): '';
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }

  getVillage(talId: number) {
    if (talId == 0) {
      return;
    }
    this.villageArray = [];
    this.commonApi.getVillageByTalukaId(talId).subscribe({
      next: (response: any) => {
        this.villageArray.push(...response);
        this.ispatch==true ? (this.postGrievanceForm.controls['villageId'].setValue(this.updatedObj?.villageId)): '';
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }

  getDepartment() {
    this.departmentArray = [];
    this.commonApi.getAllDepartment().subscribe({
      next: (response: any) => {
        this.departmentArray.push(...response);
        this.ispatch==true ? (this.postGrievanceForm.controls['deptId'].setValue(this.updatedObj?.concern_DeptId),this.getOffice(this.updatedObj?.concern_DeptId)): '';
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }

  getOffice(deptNo: number) {
    if (deptNo == 0) {
      return;
    }
    this.officeArray = [];
    this.commonApi.getOfficeByDeptId(deptNo).subscribe({
      next: (response: any) => {
        this.officeArray.push(...response);
        this.ispatch==true ? (this.postGrievanceForm.controls['officeId'].setValue(this.updatedObj?.concern_OfficeId)): '';
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }

  getStatus() {
    this.statusArray = [];
    this.commonApi.getAllStatus().subscribe({
      next: (response: any) => {
        this.statusArray.push(...response);
        
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }

  getGrievance() {
    this.natureOfGrievance = [];
    this.commonApi.getAllNatureOfGrievance().subscribe({
      next: (response: any) => {
        this.natureOfGrievance.push(...response);
        this.ispatch==true ? (this.postGrievanceForm.controls['natureGrievanceId'].setValue(this.updatedObj?.natureGrievanceId)): '';
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }

  // clearFilter(flag: any) {
  //   switch (flag) {
  //     case 'taluka': this.filterFrm.controls['villageId'].setValue(0); break;
  //     case 'department': this.filterFrm.controls['officeId'].setValue(0); break;
  //     default:
  //   }
  // }

  bindTable() {
    this.spinner.show()
    let formValue = this.filterFrm.value;
    let paramList: string = "?pageno=" + this.pageNumber + "&pagesize=" + 10 + "&TalukaId=" + formValue.talukaId + "&VillageId=" +0 + "&DeptId=" + formValue.deptId + "&OfficeId=" + 0 + "&StatusId=" + formValue.statusId;
    this.commonMethod.checkDataType(formValue.textSearch.trim()) == true ? paramList += "&Textsearch=" + formValue.textSearch : '';
    this.apiService.setHttp('get', "samadhan/Grievance/GetAllGrievance" + paramList, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.postGrivanceData = res.responseData.responseData1;
          this.dataSource = new MatTableDataSource(this.postGrivanceData);
          this.dataSource.sort = this.sort;
          this.totalRows = res.responseData.responseData2[0].pageCount;
          this.pageNumber == 1 ? this.paginator?.firstPage() : '';
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.dataSource = [];
          this.totalRows = 0;
          if (res.statusCode != "404") {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

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

  documentUpload(event: any) {
    // let documentUrlUploaed: any;
    let documentUrl: any = this.uploadFilesService.uploadDocuments(event, "grievance", "png,jpg,jpeg,JPEG")
    documentUrl.subscribe({
      next: (ele: any) => {
        this.documentUrlUploaed = ele.responseData;
        if (this.documentUrlUploaed != null) {
          let obj =    {
            "grievanceId": 0,
            "docname": "grievance",
            "docpath":this.documentUrlUploaed,
            "sortOrder": 0,
            "createdBy": this.localStrorageData.getUserId(),
            "createdDate": new Date(),
            "isDeleted": false
          }
          // this.grievanceImageArray = [];
          this.grievanceImageArray.push(obj);
        }
      },
    })  
  }

  deleteDocument(){
    this.grievanceImageArray.splice(0,1);
    this.fileInput.nativeElement.value = '';
    this.documentUrlUploaed='';
  }

  onCancelRecord() {
    this.formDirective.resetForm();
    this.ispatch = false;
  }


  postGrievanceType(flag:any) {
    // this.defaultForm();
    this.formDirective && this.formDirective.resetForm();
    this.districtArray.length == 1 ? this.postGrievanceForm.controls['districtId'].setValue(this.districtArray[0].id) : '';
    if (flag == 0) {
      this.postGrievanceForm.controls["otherCitizenName"].setValidators([Validators.required,Validators.pattern('^[^\\s0-9\\[\\[`&._@#%*!+"\'\/\\]\\]{}][a-zA-Z.\\s]+$')]);
      this.postGrievanceForm.controls["otherCitizenName"].updateValueAndValidity();
      this.postGrievanceForm.controls["otherCitizenMobileNo"].setValidators([Validators.required,Validators.pattern('[6-9]\\d{9}')]);
      this.postGrievanceForm.controls["otherCitizenMobileNo"].updateValueAndValidity();
      this.postGrievanceForm.controls["otherCitizenAddress"].setValidators([Validators.required,Validators.pattern('^[^[ ]+|[ ][gm]+$')]);
      this.postGrievanceForm.controls["otherCitizenAddress"].updateValueAndValidity();
      this.grievanceImageArray = [];
    } else {
      this.postGrievanceForm.controls['otherCitizenName'].setValue('');
      this.postGrievanceForm.controls['otherCitizenName'].clearValidators();
      this.postGrievanceForm.controls['otherCitizenName'].updateValueAndValidity();
      this.postGrievanceForm.controls['otherCitizenMobileNo'].setValue('');
      this.postGrievanceForm.controls['otherCitizenMobileNo'].clearValidators();
      this.postGrievanceForm.controls['otherCitizenMobileNo'].updateValueAndValidity();
      this.postGrievanceForm.controls['otherCitizenAddress'].setValue('');
      this.postGrievanceForm.controls['otherCitizenAddress'].clearValidators();
      this.postGrievanceForm.controls['otherCitizenAddress'].updateValueAndValidity();
      this.grievanceImageArray = [];
    }
  }

  onSubmitForm() {
    if (this.postGrievanceForm.invalid) {
      return
    } else if(!this.grievanceImageArray.length){
      this.commonMethod.matSnackBar('Document Field is Required', 1);
    }else{
      this.spinner.show();
      let formData = this.postGrievanceForm.value;
      let obj = {
        "createdBy": this.localStrorageData.getUserId(),
        "modifiedBy": this.localStrorageData.getUserId(),
        "createdDate": new Date(),
        "modifiedDate": new Date(),
        "isDeleted": false,
        "id": 0,
        "districtId": formData.districtId,
        "talukaId": formData.talukaId,
        "stateId": 1,
        "villageId": formData.villageId,
        "concern_DeptId": formData.deptId,
        "concern_OfficeId": formData.officeId,
        "natureGrievanceId": formData.natureGrievanceId,
        "grievanceDescription": formData.grievanceDescription,
        "isSelfGrievance": this.isSelfGrievance.value,
        "otherCitizenName": formData.otherCitizenName,
        "otherCitizenMobileNo": formData.otherCitizenMobileNo,
        "otherCitizenAddress": formData.otherCitizenAddress,
        "grievanceSubmissionDate": new Date(),
        "citizenGrievanceImages": this.grievanceImageArray       
      }

      this.apiService.setHttp('post', 'samadhan/Grievance/PostGrievance',false,obj,false,'samadhanMiningService');
      this.subscription = this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == 200) {
            this.spinner.hide();
            this.grievanceImageArray = [];
            // this.formDirective && this.formDirective.resetForm();
            this.defaultForm();
            this.bindTable();
            this.onCancelRecord();
            this.isSelfGrievance.setValue(1);
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 0);
          } else {
            this.spinner.hide();
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          }
        },
        error: ((error: any) => { this.error.handelError(error.status); this.spinner.hide(); })
      })
    }
  }

  patchData(ele:any){
      this.ispatch=true;
      this.updatedObj=ele;
      console.log(this.updatedObj);
      this.documentUrlUploaed=this.updatedObj.citizenGrievanceImages[0]?.docpath;
      this.isSelfGrievance.patchValue(ele.isSelfGrievance);
      this.postGrievanceForm.patchValue({
        otherCitizenName: this.updatedObj.otherCitizenName,
        otherCitizenMobileNo: this.updatedObj.otherCitizenMobileNo,
        otherCitizenAddress: this.updatedObj.otherCitizenAddress,
        grievanceDescription:this.updatedObj.grievanceDescription,
      })
      this.getDistrict();
      this.getDepartment();
      this.getGrievance();
  }

  deleteData() {
    const dialog = this.dialog.open(ConfirmationComponent, {
      width: '400px',
      data: { p1: 'Are you sure you want to delete this record?', p2: '', cardTitle: 'Delete', successBtnText: 'Delete', dialogIcon: '', cancelBtnText: 'Cancel' },
      disableClose: this.apiService.disableCloseFlag,
    })
    dialog.afterClosed().subscribe(res => {
      if (res == 'Yes') {
        this.deletePostGrievance();
      } else {
        this.selection.clear();
      }
    })
  }

  deletePostGrievance() {
    let selDelArray = this.selection.selected;
    let delArray = new Array();
    if (selDelArray.length > 0) {
      selDelArray.find((ele: any) => {
        let obj = {
          "id": ele.id,
          "deletedBy": this.localStrorageData?.getUserId(),
          "modifiedDate": new Date()
        }
        delArray.push(obj)
      })
    }
    this.apiService.setHttp('DELETE', 'samadhan/Grievance/Delete', false, delArray, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => { 
        if (res.statusCode === "200") {
          // this.highlightedRow = 0;
          this.bindTable();
          this.commonMethod.matSnackBar(res.statusMessage, 0);
          this.selection.clear();
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

