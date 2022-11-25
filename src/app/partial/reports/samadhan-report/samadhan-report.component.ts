import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-samadhan-report',
  templateUrl: './samadhan-report.component.html',
  styleUrls: ['./samadhan-report.component.css']
})
export class SamadhanReportComponent implements OnInit {
  displayedColumns: string[] = ['position', 'GrievanceNo', 'Name', 'Department','office','GrievanceType','Status'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
export interface PeriodicElement {
  position:any;
  GrievanceNo:any;
  Name:any;
  Department:any;
  office:any;
  GrievanceType:any;
  Status:any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, GrievanceNo: 'Hydrogen', Name: 1.0079, Department: 'H', office: 'shahu office', GrievanceType:'local', Status:'yes',},
  
];