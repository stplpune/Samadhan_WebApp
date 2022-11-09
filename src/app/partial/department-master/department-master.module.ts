import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentMasterRoutingModule } from './department-master-routing.module';
import { DepartmentMasterComponent } from './department-master.component';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DepartmentMasterComponent
  ],
  imports: [
    CommonModule,
    DepartmentMasterRoutingModule,
    MaterialModule,
    ReactiveFormsModule

  ]
})
export class DepartmentMasterModule { }
