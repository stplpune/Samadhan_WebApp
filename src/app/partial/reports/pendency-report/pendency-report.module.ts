import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendencyReportRoutingModule } from './pendency-report-routing.module';
import { PendencyReportComponent } from './pendency-report.component';


@NgModule({
  declarations: [
    PendencyReportComponent
  ],
  imports: [
    CommonModule,
    PendencyReportRoutingModule
  ]
})
export class PendencyReportModule { }
