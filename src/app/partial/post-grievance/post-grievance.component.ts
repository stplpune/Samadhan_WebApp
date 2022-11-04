import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
@Component({
  selector: 'app-post-grievance',
  templateUrl: './post-grievance.component.html',
  styleUrls: ['./post-grievance.component.css']
})
export class PostGrievanceComponent implements OnInit {
  stateArray:any[]=[];
  constructor(private commonApi:CommonApiService,private error:ErrorHandlerService) { }

  ngOnInit(): void {
    this.getState();
  }
  displayedColumns: string[] = [ 'srno','grievanceid', 'name', 'taluka', 'department', 'status', 'action','select'];
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


  getState() {
    this.stateArray = [];
    this.commonApi.getAllState().subscribe({
      next: (response: any) => {
       this.stateArray.push({ 'value': 0, 'text': 'Select State' }, ...response);
       console.log( this.stateArray);
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })
  }
}

export interface PeriodicElement {
  srno: number;
  grievanceid: string;
  name: string;
  taluka: string;
  department: string;
  status: string;
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, grievanceid:'Rushikesh',  name: 'Zilla Parishad',taluka:'Osmanabad ZP', department: 'HoD',status: 'Open', action: ''},
 
];