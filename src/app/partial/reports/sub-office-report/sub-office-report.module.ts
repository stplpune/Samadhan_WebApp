import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubOfficeReportRoutingModule } from './sub-office-report-routing.module';
import { SubOfficeReportComponent } from './sub-office-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';


@NgModule({
  declarations: [
    SubOfficeReportComponent
  ],
  imports: [
    CommonModule,
    SubOfficeReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class SubOfficeReportModule { }
