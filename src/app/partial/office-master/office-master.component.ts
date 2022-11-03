import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-office-master',
  templateUrl: './office-master.component.html',
  styleUrls: ['./office-master.component.css']
})
export class OfficeMasterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  displayedColumns: string[] = [ 'position', 'name', 'weight','select'];
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
export interface PeriodicElement {
  name: string;
  position: number;
  weight:any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, },
  {position: 2, name: 'Helium', weight: 4.0026,},
  {position: 3, name: 'Lithium', weight: 6.941, },
  {position: 4, name: 'Beryllium', weight: 9.0122, },
  {position: 5, name: 'Boron', weight: 10.811,},
  {position: 6, name: 'Carbon', weight: 12.0107, },
  {position: 7, name: 'Nitrogen', weight: 14.0067,},
  {position: 8, name: 'Oxygen', weight: 15.9994, },
  {position: 9, name: 'Fluorine', weight: 18.9984, },
  {position: 10, name: 'Neon', weight: 20.1797,},
];