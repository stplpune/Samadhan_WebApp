import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('../home/home.module').then(m => m.HomeModule),data: { title: ' Home' } },
  { path: 'login', loadChildren: () => import('../login/login.module').then(m => m.LoginModule), data: { title: 'Login' }, },
  { path: 'forgot-password', loadChildren: () => import('../../web/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule), data: { title: 'Forgot Password' }, },
  { path: 'about-us', loadChildren: () => import('../../web/about-us/about-us.module').then(m => m.AboutUsModule) },
  { path: 'grievance-details/:id', loadChildren: () => import('../../web/grievance-details/grievance-details.module').then(m => m.GrievanceDetailsModule) },
  // { path: 'department-report/:id', loadChildren: () => import('../../partial/reports/department-report/department-report.module').then(m => m.DepartmentReportModule), data: { title: 'Department Report' }  },
  // { path: 'office-report/:id', loadChildren: () => import('../../partial/reports/office-report/office-report.module').then(m => m.OfficeReportModule), data: { title: 'Office Report' }  },
  // { path: 'taluka-report/:id', loadChildren: () => import('../../partial/reports/taluka-report/taluka-report.module').then(m => m.TalukaReportModule), data: { title: 'Taluka Report' }  },
  // { path: 'satisfied-report/:id', loadChildren: () => import('../../partial/reports/satisfied-report/satisfied-report.module').then(m => m.SatisfiedReportModule), data: { title: 'Satisfied Report' }  },
  // { path: 'pendency-report/:id', loadChildren: () => import('../../partial/reports/pendency-report/pendency-report.module').then(m => m.PendencyReportModule), data: { title: 'Pendency Report' }  },
  // { path: 'samadhan-report', loadChildren: () => import('../../partial/reports/samadhan-report/samadhan-report.module').then(m => m.SamadhanReportModule) },
  { path: 'document-download-for-android/:id', loadChildren: () => import('../../web/document-download-for-android/document-download-for-android.module').then(m => m.DocumentDownloadForAndroidModule) },
  { path: 'contact-us', loadChildren: () => import('../../web/contact-us/contact-us.module').then(m => m.ContactUsModule) },
  { path: 'privacy-policy', loadChildren: () => import('../../web/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule) },
  { path: 'faq', loadChildren: () => import('../../web/faq/faq.module').then(m => m.FaqModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebLayoutRoutingModule { }
