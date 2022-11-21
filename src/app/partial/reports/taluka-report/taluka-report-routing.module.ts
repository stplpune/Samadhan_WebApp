import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalukaReportComponent } from './taluka-report.component';

const routes: Routes = [{ path: '', component: TalukaReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalukaReportRoutingModule { }
