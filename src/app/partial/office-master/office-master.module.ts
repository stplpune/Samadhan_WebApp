import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeMasterRoutingModule } from './office-master-routing.module';
import { OfficeMasterComponent } from './office-master.component';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OfficeMasterComponent
  ],
  imports: [
    CommonModule,
    OfficeMasterRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class OfficeMasterModule { }
