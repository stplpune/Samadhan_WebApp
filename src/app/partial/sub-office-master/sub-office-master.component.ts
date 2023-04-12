import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-sub-office-master',
  templateUrl: './sub-office-master.component.html',
  styleUrls: ['./sub-office-master.component.css']
})
export class SubOfficeMasterComponent implements OnInit {
  displayedColumns: string[] = ['srNo', 'departmentName', 'officeName','SubOfficeName', 'action'];
  dataSource: any;
  filterSubOfficeForm!: FormGroup;
  // loggedUserDeptID!: number;
  // loggedUserTypeId!: number;
  localData: any;
  departmentArr = new Array();
  officeArray = new Array();
  dropdownDisable:boolean = false;
  langTypeName: any;
  pageNo = 1;
  pageSize = 10;
  totalPages: any;
  highlightedRow!: number;
  totalRows: any;


  @ViewChild(MatPaginator) paginator!: MatPaginator;




  constructor(private fb: FormBuilder,
              public webStorage: WebStorageService,
              public commonService: CommonApiService,
              private commonMethod: CommonMethodService,
              public errorService: ErrorHandlerService,
              public validation: FormsValidationService,
              private spinner: NgxSpinnerService,
              private apiService: ApiService,
              private dialog: MatDialog,
              ) { }

  ngOnInit(): void {
    // this.loggedUserDeptID= this.webStorage.getLoggedInLocalstorageData().responseData?.deptId;
    // this.loggedUserTypeId= this.webStorage.getLoggedInLocalstorageData().responseData?.userTypeId;
    this.localData = this.webStorage. getLoggedInLocalstorageData().responseData;


    this.defaultFilterForm();
    this.getDepartments(this.webStorage.getUserId());
    this.webStorage.langNameOnChange.subscribe(message => {
      this.langTypeName = message;
     });
     this.searchSubOffData();
  }

  defaultFilterForm(){
    this.filterSubOfficeForm = this.fb.group({
      deptId: ['0'],
      officeId: ['0'],
      subOfficeName: ['']
    });
  }
  
  selection = new SelectionModel<any>(true, []);

  getDepartments(userId: number){
    this.commonService.getAllDepartmentByUserId(userId).subscribe({
      next: (response: any) => {
        this.departmentArr.push(...response);
        if(this.localData?.userTypeId == 3){       //  3 logged user userTypeId
          this.filterSubOfficeForm.controls['deptId'].setValue(this.localData?.deptId);
          this.getOffices(this.filterSubOfficeForm.value.deptId);
          this.dropdownDisable=true;
        }
      },
      error: ((error: any) => { this.errorService.handelError(error.status) })
    });
  }


  getOffices(deptNo:number){
    if (deptNo == 0) {
      return;
    }
    this.officeArray=[];
    this.commonService.getOfficeByDeptId(deptNo).subscribe({
      next: (response: any) => {
        this.officeArray.push(...response); 
        if(this.localData?.userTypeId == 4){
          this.filterSubOfficeForm.controls['officeId'].setValue(this.localData?.officeId);
          this.dropdownDisable=true;
         }   
      },
      error: ((error: any) => { this.errorService.handelError(error.status) })
    });
  }

    //by suboffice Search start
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

    pageChanged(event: any){
      this.pageNo = event.pageIndex + 1;
      this.searchSubOffData();
      this.onCancelRecord();
      this.selection.clear();
  
    }
  

  filterData(){
    this.pageNo = 1;
    this.searchSubOffData();
    this.onCancelRecord();
  }
// getAll subOffice data 
  searchSubOffData(){
    this.spinner.show();
    let formData = this.filterSubOfficeForm.value;
    this.apiService.setHttp('get','samadhan/SubOffice/GetAll?pageno=' +this.pageNo+'&pagesize=' +this.pageSize+'&DeptId='+ formData.deptId+'&OfficeId='+formData.officeId +'&Name='+formData.subOfficeName,false,false,false,'samadhanMiningService');
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

  editSubOffice(obj: any){
    console.log(obj);
    
  }

  //select unselect Checkbox
  masterToggle(){
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
  

  deleteData(){
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

  deleteSubOffice(){
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

  onCancelRecord(){
    // this.formDirective.resetForm();
    // this.isEdit = false;
    this.highlightedRow = 0;
  if(this.localData?.userTypeId == 3){       //  3 logged user userTypeId
    // this.frmOffice.controls['deptId'].setValue(this.loggedUserDeptID);
    this.dropdownDisable=true;
  }
   this.selection.clear();
  }

  clearFilter(flag: string){
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

}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}