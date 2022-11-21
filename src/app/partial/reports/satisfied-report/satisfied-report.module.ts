import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SatisfiedReportRoutingModule } from './satisfied-report-routing.module';
import { SatisfiedReportComponent } from './satisfied-report.component';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SatisfiedReportComponent
  ],
  imports: [
    CommonModule,
    SatisfiedReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class SatisfiedReportModule { }
