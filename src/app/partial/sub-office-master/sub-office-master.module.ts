import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubOfficeMasterRoutingModule } from './sub-office-master-routing.module';
import { SubOfficeMasterComponent } from './sub-office-master.component';


@NgModule({
  declarations: [
    SubOfficeMasterComponent
  ],
  imports: [
    CommonModule,
    SubOfficeMasterRoutingModule
  ]
})
export class SubOfficeMasterModule { }
