import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingReportRoutingModule } from './pending-report-routing.module';
import { PendingReportComponent } from './pending-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';


@NgModule({
  declarations: [
    PendingReportComponent
  ],
  imports: [
    CommonModule,
    PendingReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class PendingReportModule { }
