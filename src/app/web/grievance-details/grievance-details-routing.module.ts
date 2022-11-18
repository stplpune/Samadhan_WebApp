import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrievanceDetailsComponent } from './grievance-details.component';

const routes: Routes = [{ path: '', component: GrievanceDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrievanceDetailsRoutingModule { }
