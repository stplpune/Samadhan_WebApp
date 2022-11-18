import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrievanceDetailsRoutingModule } from './grievance-details-routing.module';
import { GrievanceDetailsComponent } from './grievance-details.component';


@NgModule({
  declarations: [
    GrievanceDetailsComponent
  ],
  imports: [
    CommonModule,
    GrievanceDetailsRoutingModule
  ]
})
export class GrievanceDetailsModule { }
