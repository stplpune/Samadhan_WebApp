import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendencyReportComponent } from './pendency-report.component';

const routes: Routes = [{ path: '', component: PendencyReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendencyReportRoutingModule { }
