import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentMasterComponent } from './department-master.component';

const routes: Routes = [{ path: '', component: DepartmentMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentMasterRoutingModule { }
