import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrievanceDetailsRoutingModule } from './grievance-details-routing.module';
import { GrievanceDetailsComponent } from './grievance-details.component';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';


@NgModule({
  declarations: [
    GrievanceDetailsComponent
  ],
  imports: [
    CommonModule,
    GrievanceDetailsRoutingModule,
    MaterialModule,
  ]
})
export class GrievanceDetailsModule { }
