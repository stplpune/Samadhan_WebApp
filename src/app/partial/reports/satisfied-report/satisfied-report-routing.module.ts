import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SatisfiedReportComponent } from './satisfied-report.component';

const routes: Routes = [{ path: '', component: SatisfiedReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SatisfiedReportRoutingModule { }
