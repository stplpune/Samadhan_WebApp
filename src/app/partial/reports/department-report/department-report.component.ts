import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-department-report',
  templateUrl: './department-report.component.html',
  styleUrls: ['./department-report.component.css']
})
export class DepartmentReportComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'Received', 'Pending','Resolved'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Water Resource Department', Received: '60', Pending: '60',Resolved:'10'},

];

export interface PeriodicElement {
  name: any;
  position: any;
  Received: any;
  Pending: any;
  Resolved:any;
}