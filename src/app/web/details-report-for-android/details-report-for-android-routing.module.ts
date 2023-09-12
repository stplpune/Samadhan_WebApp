import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsReportForAndroidComponent } from './details-report-for-android.component';

const routes: Routes = [{ path: '', component: DetailsReportForAndroidComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsReportForAndroidRoutingModule { }
