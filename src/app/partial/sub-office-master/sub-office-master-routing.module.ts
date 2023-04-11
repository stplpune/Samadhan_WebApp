import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubOfficeMasterComponent } from './sub-office-master.component';

const routes: Routes = [{ path: '', component: SubOfficeMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubOfficeMasterRoutingModule { }
