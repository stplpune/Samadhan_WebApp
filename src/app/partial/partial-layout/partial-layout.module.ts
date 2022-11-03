import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartialLayoutRoutes } from './partial-layout.routing';
import { MaterialModule } from './../../shared/AngularMaterialModule/material.module';





@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PartialLayoutRoutes),
    FormsModule, 
    ReactiveFormsModule,
    MaterialModule
  ]  
})
export class PartialLayoutModule { }
