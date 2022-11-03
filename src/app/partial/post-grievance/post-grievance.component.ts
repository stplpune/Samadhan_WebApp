import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-post-grievance',
  templateUrl: './post-grievance.component.html',
  styleUrls: ['./post-grievance.component.css']
})
export class PostGrievanceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  displayedColumns: string[] = [ 'srno','taluka', 'village', 'department', 'office', 'status', 'action','select'];
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
  taluka: string;
  village: string;
  department: string;
  office: string;
  status: number;
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, taluka:'Rushikesh',  village: 'Zilla Parishad',department:'Osmanabad ZP', office: 'HoD',status: 8669264767, action: ''},
 
];