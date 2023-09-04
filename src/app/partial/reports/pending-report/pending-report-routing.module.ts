import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingReportComponent } from './pending-report.component';

const routes: Routes = [{ path: '', component: PendingReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingReportRoutingModule { }
