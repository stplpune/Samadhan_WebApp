import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeMasterRoutingModule } from './office-master-routing.module';
import { OfficeMasterComponent } from './office-master.component';


@NgModule({
  declarations: [
    OfficeMasterComponent
  ],
  imports: [
    CommonModule,
    OfficeMasterRoutingModule
  ]
})
export class OfficeMasterModule { }
