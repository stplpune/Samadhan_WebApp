import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRightAccessRoutingModule } from './user-right-access-routing.module';
import { UserRightAccessComponent } from './user-right-access.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';


@NgModule({
  declarations: [
    UserRightAccessComponent
  ],
  imports: [
    CommonModule,
    UserRightAccessRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class UserRightAccessModule { }
