import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SamadhanReportComponent } from './samadhan-report.component';

const routes: Routes = [{ path: '', component: SamadhanReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SamadhanReportRoutingModule { }
