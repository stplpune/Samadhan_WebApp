import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentReportRoutingModule } from './department-report-routing.module';
import { DepartmentReportComponent } from './department-report.component';


@NgModule({
  declarations: [
    DepartmentReportComponent
  ],
  imports: [
    CommonModule,
    DepartmentReportRoutingModule
  ]
})
export class DepartmentReportModule { }
