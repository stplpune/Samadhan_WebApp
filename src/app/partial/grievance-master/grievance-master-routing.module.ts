import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrievanceMasterComponent } from './grievance-master.component';

const routes: Routes = [{ path: '', component: GrievanceMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrievanceMasterRoutingModule { }
