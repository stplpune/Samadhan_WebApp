import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectorReferenceReportRoutingModule } from './collector-reference-report-routing.module';
import { CollectorReferenceReportComponent } from './collector-reference-report.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    CollectorReferenceReportComponent
  ],
  imports: [
    CommonModule,
    CollectorReferenceReportRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    MatTableModule,
    TranslateModule
  ]
})
export class CollectorReferenceReportModule { }
