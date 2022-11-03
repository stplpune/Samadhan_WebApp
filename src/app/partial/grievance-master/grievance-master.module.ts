import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrievanceMasterRoutingModule } from './grievance-master-routing.module';
import { GrievanceMasterComponent } from './grievance-master.component';


@NgModule({
  declarations: [
    GrievanceMasterComponent
  ],
  imports: [
    CommonModule,
    GrievanceMasterRoutingModule
  ]
})
export class GrievanceMasterModule { }
