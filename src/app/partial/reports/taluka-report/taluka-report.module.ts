import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TalukaReportRoutingModule } from './taluka-report-routing.module';
import { TalukaReportComponent } from './taluka-report.component';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TalukaReportComponent
  ],
  imports: [
    CommonModule,
    TalukaReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class TalukaReportModule { }
