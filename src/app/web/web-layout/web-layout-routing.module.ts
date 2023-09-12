import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('../home/home.module').then(m => m.HomeModule),data: { breadcrumb: [{ title: 'Home', active: true }]} },
  { path: 'login', loadChildren: () => import('../login/login.module').then(m => m.LoginModule), data: { breadcrumb: [{ title: 'Login', active: true }]} },
  { path: 'forgot-password', loadChildren: () => import('../../web/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule), data: { breadcrumb: [{ title: 'Forgot Password', active: true }]} },
  { path: 'about-us', loadChildren: () => import('../../web/about-us/about-us.module').then(m => m.AboutUsModule),data: { breadcrumb: [{ title: 'About Us', active: true }]} },
  { path: 'grievance-details/:id', loadChildren: () => import('../../web/grievance-details/grievance-details.module').then(m => m.GrievanceDetailsModule) },
  { path: 'document-download-for-android/:id', loadChildren: () => import('../../web/document-download-for-android/document-download-for-android.module').then(m => m.DocumentDownloadForAndroidModule) },
  { path: 'contact-us', loadChildren: () => import('../../web/contact-us/contact-us.module').then(m => m.ContactUsModule),data: { breadcrumb: [{ title: 'Contact Us', active: true }]} },
  { path: 'privacy-policy', loadChildren: () => import('../../web/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule) },
  { path: 'faq', loadChildren: () => import('../../web/faq/faq.module').then(m => m.FaqModule) },
  { path: 'details-report-for-android/:id', loadChildren: () => import('../../web/details-report-for-android/details-report-for-android.module').then(m => m.DetailsReportForAndroidModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebLayoutRoutingModule { }
