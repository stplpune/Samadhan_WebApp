import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  displayedColumns: string[] = [ 'srno','name', 'department', 'office', 'designation', 'mobileno', 'action','select'];
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
  srno: number;
  name: string;
  department: string;
  office: string;
  designation: string;
  mobileno: number;
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1,name:'Rushikesh',  department: 'Zilla Parishad',office:'Osmanabad ZP', designation: 'HoD',mobileno: 8669264767, action: ''},
 
 
];
