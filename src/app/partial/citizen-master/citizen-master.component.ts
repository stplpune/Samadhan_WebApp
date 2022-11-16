import { Component, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
// import { ApiService } from 'src/app/core/service/api.service';
// import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigService } from 'src/app/configs/config.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonMethodService } from 'src/app/core/service/common-method.service';


@Component({
  selector: 'app-citizen-master',
  templateUrl: './citizen-master.component.html',
  styleUrls: ['./citizen-master.component.css']
})
export class CitizenMasterComponent implements OnInit {
  @ViewChild('formDirective') formDirective!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  frmCitizen!:FormGroup

  constructor(
    private fb: FormBuilder,
    // private apiService: ApiService,
    public error: ErrorHandlerService,
    // private spinner: NgxSpinnerService,
    public configService: ConfigService,
    public validation: FormsValidationService,
    public localStrorageData: WebStorageService,
    // private webStorage:WebStorageService,
    public dialog: MatDialog,
    public commonMethod: CommonMethodService
  ) { }

  ngOnInit(): void {
  }

  createCitizenForm(){
    this.frmCitizen = this.fb.group({

    })
  }

  displayedColumns: string[] = [ 'srno', 'name', 'mobileno','emailId', 'taluka','village', 'select'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.srno + 1}`;
  }

}
export interface PeriodicElement {
  srno:number;
  name: string;
  mobileno: number;
  emailId: any;
  taluka: string;
  village:string;
  action:any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, name: 'Hydrogen', mobileno: 8669264767, emailId: 'H@gmail.com',taluka:'Pune',village:'Rajgrurnagar',action:''},
  {srno: 2, name: 'Hydrogen', mobileno: 8669264767, emailId: 'H@gmail.com',taluka:'Pune',village:'Rajgrurnagar',action:''},
  {srno: 3, name: 'Hydrogen', mobileno: 8669264767, emailId: 'H@gmail.com',taluka:'Pune',village:'Rajgrurnagar',action:''},

];
