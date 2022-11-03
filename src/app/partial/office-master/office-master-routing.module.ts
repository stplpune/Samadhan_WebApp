import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficeMasterComponent } from './office-master.component';

const routes: Routes = [{ path: '', component: OfficeMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeMasterRoutingModule { }
