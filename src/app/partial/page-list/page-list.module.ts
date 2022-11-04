import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageListRoutingModule } from './page-list-routing.module';
import { PageListComponent } from './page-list.component';


@NgModule({
  declarations: [
    PageListComponent
  ],
  imports: [
    CommonModule,
    PageListRoutingModule
  ]
})
export class PageListModule { }
