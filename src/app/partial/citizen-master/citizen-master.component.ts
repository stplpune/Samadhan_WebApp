import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-citizen-master',
  templateUrl: './citizen-master.component.html',
  styleUrls: ['./citizen-master.component.css']
})
export class CitizenMasterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
  