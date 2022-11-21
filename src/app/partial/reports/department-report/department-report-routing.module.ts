import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentReportComponent } from './department-report.component';

const routes: Routes = [{ path: '', component: DepartmentReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentReportRoutingModule { }
