import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-grievance-master',
  templateUrl: './grievance-master.component.html',
  styleUrls: ['./grievance-master.component.css']
})
export class GrievanceMasterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  displayedColumns: string[] = [ 'srno', 'department', 'grievanceType', 'action','select'];
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
  department: string;
  grievanceType: string;
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, department: 'Zilla Parishad', grievanceType: 'Water Supply', action: ''},
  {srno: 2, department: 'Zilla Parishad', grievanceType: 'Water Supply', action: ''},
  {srno: 3, department: 'Zilla Parishad', grievanceType: 'Water Supply', action: ''},
  {srno: 4, department: 'Zilla Parishad', grievanceType: 'Water Supply', action: ''},
  {srno: 5, department: 'Zilla Parishad', grievanceType: 'Water Supply', action: ''},
  {srno: 6, department: 'Zilla Parishad', grievanceType: 'Water Supply', action: ''},
  {srno: 7, department: 'Zilla Parishad', grievanceType: 'Water Supply', action: ''},
  {srno: 8, department: 'Zilla Parishad', grievanceType: 'Water Supply', action: ''},
  {srno: 9, department: 'Zilla Parishad', grievanceType: 'Water Supply', action: ''},
  {srno: 10, department: 'Zilla Parishad', grievanceType: 'Water Supply', action: ''},
 
];

