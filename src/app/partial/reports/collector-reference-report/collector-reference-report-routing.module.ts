import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectorReferenceReportComponent } from './collector-reference-report.component';

const routes: Routes = [{ path: '', component: CollectorReferenceReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectorReferenceReportRoutingModule { }
