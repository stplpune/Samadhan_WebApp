import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SafetyStandardRoutingModule } from './safety-standard-routing.module';
import { SafetyStandardComponent } from './safety-standard.component';


@NgModule({
  declarations: [
    SafetyStandardComponent
  ],
  imports: [
    CommonModule,
    SafetyStandardRoutingModule
  ]
})
export class SafetyStandardModule { }
