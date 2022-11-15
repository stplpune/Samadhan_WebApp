import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitizenMasterRoutingModule } from './citizen-master-routing.module';
import { CitizenMasterComponent } from './citizen-master.component';


@NgModule({
  declarations: [
    CitizenMasterComponent
  ],
  imports: [
    CommonModule,
    CitizenMasterRoutingModule
  ]
})
export class CitizenMasterModule { }
