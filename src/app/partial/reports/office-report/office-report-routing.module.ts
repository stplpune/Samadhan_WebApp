import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficeReportComponent } from './office-report.component';

const routes: Routes = [{ path: '', component: OfficeReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeReportRoutingModule { }
