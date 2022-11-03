import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeMasterRoutingModule } from './office-master-routing.module';
import { OfficeMasterComponent } from './office-master.component';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';

@NgModule({
  declarations: [
    OfficeMasterComponent
  ],
  imports: [
    CommonModule,
    OfficeMasterRoutingModule,
    MaterialModule
  ]
})
export class OfficeMasterModule { }
