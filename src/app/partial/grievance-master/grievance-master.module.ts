import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrievanceMasterRoutingModule } from './grievance-master-routing.module';
import { GrievanceMasterComponent } from './grievance-master.component';
import { MaterialModule} from '../../shared/AngularMaterialModule/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GrievanceMasterComponent
  ],
  imports: [
    CommonModule,
    GrievanceMasterRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class GrievanceMasterModule { }
