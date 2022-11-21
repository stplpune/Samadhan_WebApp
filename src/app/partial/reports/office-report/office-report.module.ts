import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeReportRoutingModule } from './office-report-routing.module';
import { OfficeReportComponent } from './office-report.component';


@NgModule({
  declarations: [
    OfficeReportComponent
  ],
  imports: [
    CommonModule,
    OfficeReportRoutingModule
  ]
})
export class OfficeReportModule { }
