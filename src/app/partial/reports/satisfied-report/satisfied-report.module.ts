import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SatisfiedReportRoutingModule } from './satisfied-report-routing.module';
import { SatisfiedReportComponent } from './satisfied-report.component';


@NgModule({
  declarations: [
    SatisfiedReportComponent
  ],
  imports: [
    CommonModule,
    SatisfiedReportRoutingModule
  ]
})
export class SatisfiedReportModule { }
