import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SafetyStandardComponent } from './safety-standard.component';

const routes: Routes = [{ path: '', component: SafetyStandardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SafetyStandardRoutingModule { }
