import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitizenMasterComponent } from './citizen-master.component';

const routes: Routes = [{ path: '', component: CitizenMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitizenMasterRoutingModule { }
