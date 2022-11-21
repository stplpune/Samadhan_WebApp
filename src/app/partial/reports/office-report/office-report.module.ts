import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeReportRoutingModule } from './office-report-routing.module';
import { OfficeReportComponent } from './office-report.component';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OfficeReportComponent
  ],
  imports: [
    CommonModule,
    OfficeReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class OfficeReportModule { }
