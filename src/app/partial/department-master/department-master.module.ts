import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentMasterRoutingModule } from './department-master-routing.module';
import { DepartmentMasterComponent } from './department-master.component';


@NgModule({
  declarations: [
    DepartmentMasterComponent
  ],
  imports: [
    CommonModule,
    DepartmentMasterRoutingModule
  ]
})
export class DepartmentMasterModule { }
