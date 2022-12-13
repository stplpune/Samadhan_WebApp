import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostGrievanceRoutingModule } from './post-grievance-routing.module';
import { PostGrievanceComponent } from './post-grievance.component';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    PostGrievanceComponent
  ],
  imports: [
    CommonModule,
    PostGrievanceRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class PostGrievanceModule { }
