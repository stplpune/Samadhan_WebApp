import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentReportRoutingModule } from './department-report-routing.module';
import { DepartmentReportComponent } from './department-report.component';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DepartmentReportComponent
  ],
  imports: [
    CommonModule,
    DepartmentReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class DepartmentReportModule { }
