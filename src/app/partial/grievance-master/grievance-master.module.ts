import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrievanceMasterRoutingModule } from './grievance-master-routing.module';
import { GrievanceMasterComponent } from './grievance-master.component';
import { MaterialModule} from '../../shared/AngularMaterialModule/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GrievanceMasterComponent
  ],
  imports: [
    CommonModule,
    GrievanceMasterRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class GrievanceMasterModule { }
