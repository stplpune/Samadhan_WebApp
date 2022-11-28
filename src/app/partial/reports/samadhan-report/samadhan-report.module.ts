import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamadhanReportRoutingModule } from './samadhan-report-routing.module';
import { SamadhanReportComponent } from './samadhan-report.component';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SamadhanReportComponent
  ],
  imports: [
    CommonModule,
    SamadhanReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class SamadhanReportModule { }
