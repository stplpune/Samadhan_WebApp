import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pendency-report',
  templateUrl: './pendency-report.component.html',
  styleUrls: ['./pendency-report.component.css']
})
export class PendencyReportComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name','Received', 'Pending','ActionTaken'];
  dataSource = ELEMENT_DATA;


  ngOnInit(): void {
  }

}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Water Resource Department', Received:'Municipal Corporation',ActionTaken: '60', Pending: '60'},
  {position: 2, name: 'Water Resource Department', Received:'Municipal Corporation',ActionTaken: '60', Pending: '60'},
  {position: 3, name: 'Water Resource Department', Received:'Municipal Corporation',ActionTaken: '60', Pending: '60'},
  {position: 4, name: 'Water Resource Department', Received:'Municipal Corporation',ActionTaken: '60', Pending: '60'},
  {position: 5, name: 'Water Resource Department', Received:'Municipal Corporation',ActionTaken: '60', Pending: '60'},
  {position: 6, name: 'Water Resource Department', Received:'Municipal Corporation',ActionTaken: '60', Pending: '60'},
  {position: 7, name: 'Water Resource Department', Received:'Municipal Corporation',ActionTaken: '60', Pending: '60'},
  {position: 8, name: 'Water Resource Department', Received:'Municipal Corporation',ActionTaken: '60', Pending: '60'},
  {position: 9, name: 'Water Resource Department', Received:'Municipal Corporation',ActionTaken: '60', Pending: '60'},
  {position: 10, name: 'Water Resource Department', Received:'Municipal Corporation',ActionTaken:'60', Pending: '60'},

];

export interface PeriodicElement {
  position:any;
  name:  any;
  Received: any;
  ActionTaken:any;
  Pending:any; 
}