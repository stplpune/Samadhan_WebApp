import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-office-report',
  templateUrl: './office-report.component.html',
  styleUrls: ['./office-report.component.css']
})
export class OfficeReportComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'OfficeName','Received', 'Pending','Resolved'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Water Resource Department', OfficeName:'Municipal Corporation', Received: '60', Pending: '60',Resolved:'10'},
  {position: 2, name: 'Water Resource Department', OfficeName:'Municipal Corporation', Received: '60', Pending: '60',Resolved:'10'},
  {position: 3, name: 'Water Resource Department', OfficeName:'Municipal Corporation', Received: '60', Pending: '60',Resolved:'10'},
  {position: 4, name: 'Water Resource Department', OfficeName:'Municipal Corporation', Received: '60', Pending: '60',Resolved:'10'},
  {position: 5, name: 'Water Resource Department', OfficeName:'Municipal Corporation', Received: '60', Pending: '60',Resolved:'10'},
  {position: 6, name: 'Water Resource Department', OfficeName:'Municipal Corporation', Received: '60', Pending: '60',Resolved:'10'},
  {position: 7, name: 'Water Resource Department', OfficeName:'Municipal Corporation', Received: '60', Pending: '60',Resolved:'10'},
  {position: 8, name: 'Water Resource Department', OfficeName:'Municipal Corporation', Received: '60', Pending: '60',Resolved:'10'},
  {position: 9, name: 'Water Resource Department', OfficeName:'Municipal Corporation', Received: '60', Pending: '60',Resolved:'10'},
  {position: 10, name: 'Water Resource Department', OfficeName:'Municipal Corporation', Received: '60', Pending: '60',Resolved:'10'},

];

export interface PeriodicElement {
  name: any;
  position: any;
  Received: any;
  Pending: any;
  Resolved:any;
  OfficeName:any;
}