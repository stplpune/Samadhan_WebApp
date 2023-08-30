import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubOfficeReportComponent } from './sub-office-report.component';

const routes: Routes = [{ path: '', component: SubOfficeReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubOfficeReportRoutingModule { }
