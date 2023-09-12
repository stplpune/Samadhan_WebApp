import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsReportForAndroidRoutingModule } from './details-report-for-android-routing.module';
import { DetailsReportForAndroidComponent } from './details-report-for-android.component';


@NgModule({
  declarations: [
    DetailsReportForAndroidComponent
  ],
  imports: [
    CommonModule,
    DetailsReportForAndroidRoutingModule
  ]
})
export class DetailsReportForAndroidModule { }
