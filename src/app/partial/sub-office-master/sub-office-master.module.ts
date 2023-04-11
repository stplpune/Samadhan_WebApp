import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubOfficeMasterRoutingModule } from './sub-office-master-routing.module';
import { SubOfficeMasterComponent } from './sub-office-master.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';


@NgModule({
  declarations: [
    SubOfficeMasterComponent
  ],
  imports: [
    CommonModule,
    SubOfficeMasterRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class SubOfficeMasterModule { }
