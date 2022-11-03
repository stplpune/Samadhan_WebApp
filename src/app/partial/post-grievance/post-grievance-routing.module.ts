import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostGrievanceComponent } from './post-grievance.component';

const routes: Routes = [{ path: '', component: PostGrievanceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostGrievanceRoutingModule { }
