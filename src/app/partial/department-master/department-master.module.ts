import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentMasterRoutingModule } from './department-master-routing.module';
import { DepartmentMasterComponent } from './department-master.component';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';

@NgModule({
  declarations: [
    DepartmentMasterComponent
  ],
  imports: [
    CommonModule,
    DepartmentMasterRoutingModule,
    MaterialModule
  ]
})
export class DepartmentMasterModule { }
