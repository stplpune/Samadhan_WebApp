import {  Routes } from '@angular/router';

export const PartialLayoutRoutes: Routes = [
  { path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule), data: { title: 'Dashboard' } },
  { path: 'department-master', loadChildren: () => import('../../partial/department-master/department-master.module').then(m => m.DepartmentMasterModule), data: { title: 'Department Master' } },
  { path: 'office-master', loadChildren: () => import('../../partial/office-master/office-master.module').then(m => m.OfficeMasterModule), data: { title: 'Office Master' } },
  { path: 'citizen-master', loadChildren: () => import('../../partial/citizen-master/citizen-master.module').then(m => m.CitizenMasterModule), data: { title: 'Citizen Master' } },
  { path: 'user-registration', loadChildren: () => import('../../partial/user-registration/user-registration.module').then(m => m.UserRegistrationModule), data: { title: 'User Registration' } },
  { path: 'grievance-master', loadChildren: () => import('../../partial/grievance-master/grievance-master.module').then(m => m.GrievanceMasterModule), data: { title: 'Grivance Master' } },
  { path: 'post-grievance', loadChildren: () => import('../../partial/post-grievance/post-grievance.module').then(m => m.PostGrievanceModule), data: { title: 'Post Grivance' } },
  { path: 'page-list', loadChildren: () => import('../../partial/page-list/page-list.module').then(m => m.PageListModule), data: { title: 'Page List' } },
  { path: 'user-right-access', loadChildren: () => import('../../partial/user-right-access/user-right-access.module').then(m => m.UserRightAccessModule), data: { title: 'User Right Access' } },
  { path: 'department-report', loadChildren: () => import('../../partial/reports/department-report/department-report.module').then(m => m.DepartmentReportModule), data: { title: 'Department Report' } },
  { path: 'office-report', loadChildren: () => import('../../partial/reports/office-report/office-report.module').then(m => m.OfficeReportModule), data: { title: 'Office Report' } },
  { path: 'taluka-report', loadChildren: () => import('../../partial/reports/taluka-report/taluka-report.module').then(m => m.TalukaReportModule), data: { title: 'Taluka Report' } },
  { path: 'satisfied-report', loadChildren: () => import('../../partial/reports/satisfied-report/satisfied-report.module').then(m => m.SatisfiedReportModule), data: { title: 'Satisfied Report' } },
  { path: 'pendency-report', loadChildren: () => import('../../partial/reports/pendency-report/pendency-report.module').then(m => m.PendencyReportModule), data: { title: 'Pendency Report' } },
];
