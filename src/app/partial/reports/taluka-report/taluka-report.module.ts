import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TalukaReportRoutingModule } from './taluka-report-routing.module';
import { TalukaReportComponent } from './taluka-report.component';


@NgModule({
  declarations: [
    TalukaReportComponent
  ],
  imports: [
    CommonModule,
    TalukaReportRoutingModule
  ]
})
export class TalukaReportModule { }
