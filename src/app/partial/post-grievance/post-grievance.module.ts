import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostGrievanceRoutingModule } from './post-grievance-routing.module';
import { PostGrievanceComponent } from './post-grievance.component';


@NgModule({
  declarations: [
    PostGrievanceComponent
  ],
  imports: [
    CommonModule,
    PostGrievanceRoutingModule
  ]
})
export class PostGrievanceModule { }
