import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendencyReportRoutingModule } from './pendency-report-routing.module';
import { PendencyReportComponent } from './pendency-report.component';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PendencyReportComponent
  ],
  imports: [
    CommonModule,
    PendencyReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class PendencyReportModule { }
