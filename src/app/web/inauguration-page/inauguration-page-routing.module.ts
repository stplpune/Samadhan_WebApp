import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InaugurationPageComponent } from './inauguration-page.component';

const routes: Routes = [{ path: '', component: InaugurationPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InaugurationPageRoutingModule { }
