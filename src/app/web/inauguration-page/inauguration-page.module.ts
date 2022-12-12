import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InaugurationPageRoutingModule } from './inauguration-page-routing.module';
import { InaugurationPageComponent } from './inauguration-page.component';


@NgModule({
  declarations: [
    InaugurationPageComponent
  ],
  imports: [
    CommonModule,
    InaugurationPageRoutingModule
  ]
})
export class InaugurationPageModule { }
