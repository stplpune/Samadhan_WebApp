import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamadhanReportRoutingModule } from './samadhan-report-routing.module';
import { SamadhanReportComponent } from './samadhan-report.component';


@NgModule({
  declarations: [
    SamadhanReportComponent
  ],
  imports: [
    CommonModule,
    SamadhanReportRoutingModule
  ]
})
export class SamadhanReportModule { }
