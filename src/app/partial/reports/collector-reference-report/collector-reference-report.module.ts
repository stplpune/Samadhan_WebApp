import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectorReferenceReportRoutingModule } from './collector-reference-report-routing.module';
import { CollectorReferenceReportComponent } from './collector-reference-report.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';


@NgModule({
  declarations: [
    CollectorReferenceReportComponent
  ],
  imports: [
    CommonModule,
    CollectorReferenceReportRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class CollectorReferenceReportModule { }
