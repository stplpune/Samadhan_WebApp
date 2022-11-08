import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebLayoutComponent } from './web/web-layout/web-layout.component';
import { PartialLayoutComponent } from './partial/partial-layout/partial-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { CheckLoggedInGuard } from './core/guards/check-logged-in.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: WebLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./web/web-layout/web-layout.module').then(m => m.WebLayoutModule) },
      // {path:'home',loadChildren: () => import('./web/home/home.module').then(m => m.HomeModule) ,canActivate:[CheckLoggedInGuard]},
      { path: 'login', loadChildren: () => import('./web/login/login.module').then(m => m.LoginModule) ,canActivate:[CheckLoggedInGuard]},  
    ]
  },
  {
    path: '',
    canActivate:[AuthGuard],
    component: PartialLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./partial/partial-layout/partial-layout.module').then(m => m.PartialLayoutModule), data: { title: 'Login' } },
    ]
  },
 
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
