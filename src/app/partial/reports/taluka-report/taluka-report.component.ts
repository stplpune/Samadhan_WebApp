import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-taluka-report',
  templateUrl: './taluka-report.component.html',
  styleUrls: ['./taluka-report.component.css']
})
export class TalukaReportComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name','Received', 'Pending','Resolved'];
  dataSource = ELEMENT_DATA;

  ngOnInit(): void {
  }

}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Water Resource Department', Received:'Municipal Corporation',Resolved: '60', Pending: '60'},
  {position: 2, name: 'Water Resource Department', Received:'Municipal Corporation',Resolved: '60', Pending: '60'},
  {position: 3, name: 'Water Resource Department', Received:'Municipal Corporation',Resolved: '60', Pending: '60'},
  {position: 4, name: 'Water Resource Department', Received:'Municipal Corporation',Resolved: '60', Pending: '60'},
  {position: 5, name: 'Water Resource Department', Received:'Municipal Corporation',Resolved: '60', Pending: '60'},
  {position: 6, name: 'Water Resource Department', Received:'Municipal Corporation',Resolved: '60', Pending: '60'},
  {position: 7, name: 'Water Resource Department', Received:'Municipal Corporation',Resolved: '60', Pending: '60'},
  {position: 8, name: 'Water Resource Department', Received:'Municipal Corporation',Resolved: '60', Pending: '60'},
  {position: 9, name: 'Water Resource Department', Received:'Municipal Corporation',Resolved: '60', Pending: '60'},
  {position: 10, name: 'Water Resource Department', Received:'Municipal Corporation',Resolved:'60', Pending: '60'},

];

export interface PeriodicElement {
  position:any;
  name:  any;
  Received: any;
  Resolved:any;
  Pending:any; 
}