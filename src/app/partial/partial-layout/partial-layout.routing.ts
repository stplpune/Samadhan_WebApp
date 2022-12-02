import {  Routes } from '@angular/router';
import { ExpenseGuard } from 'src/app/core/guards/expense.guard';

export const PartialLayoutRoutes: Routes = [
  { path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }]} , canActivate: [ExpenseGuard] },
  { path: 'department-master', loadChildren: () => import('../../partial/department-master/department-master.module').then(m => m.DepartmentMasterModule),data: { breadcrumb: [{ title: 'Department Master', titleMarathi: 'विभाग मास्टर', active: true }]}, canActivate: [ExpenseGuard] },
  { path: 'office-master', loadChildren: () => import('../../partial/office-master/office-master.module').then(m => m.OfficeMasterModule), data: { breadcrumb: [{ title: 'Office Master', active: true }]}, canActivate: [ExpenseGuard] },
  { path: 'citizen-master', loadChildren: () => import('../../partial/citizen-master/citizen-master.module').then(m => m.CitizenMasterModule), data: { breadcrumb: [{ title: 'Citizen Master', active: true }]}, canActivate: [ExpenseGuard] },
  { path: 'user-registration', loadChildren: () => import('../../partial/user-registration/user-registration.module').then(m => m.UserRegistrationModule), data: { breadcrumb: [{ title: 'User Registration ', active: true }]}, canActivate: [ExpenseGuard] },
  { path: 'grievance-master', loadChildren: () => import('../../partial/grievance-master/grievance-master.module').then(m => m.GrievanceMasterModule), data: { breadcrumb: [{ title: 'Grievance Master', active: true }]}, canActivate: [ExpenseGuard] },
  { path: 'collector-references', loadChildren: () => import('../../partial/post-grievance/post-grievance.module').then(m => m.PostGrievanceModule), data: { breadcrumb: [{ title: 'Collector References', active: true }]}, canActivate: [ExpenseGuard] },
  { path: 'page-list', loadChildren: () => import('../../partial/page-list/page-list.module').then(m => m.PageListModule), data: { title: 'Page List' }, canActivate: [ExpenseGuard] },
  { path: 'user-right-access', loadChildren: () => import('../../partial/user-right-access/user-right-access.module').then(m => m.UserRightAccessModule), data: { breadcrumb: [{ title: 'User Right Access', active: true }]}, canActivate: [ExpenseGuard] },
  { path: 'department-report', loadChildren: () => import('../../partial/reports/department-report/department-report.module').then(m => m.DepartmentReportModule), data: { breadcrumb: [{ title: 'Department Reports', active: true }]}, canActivate: [ExpenseGuard] },
  { path: 'office-report', loadChildren: () => import('../../partial/reports/office-report/office-report.module').then(m => m.OfficeReportModule), data: { breadcrumb: [{ title: 'Office Reports', active: true }]}, canActivate: [ExpenseGuard] },
  { path: 'taluka-report', loadChildren: () => import('../../partial/reports/taluka-report/taluka-report.module').then(m => m.TalukaReportModule), data: { breadcrumb: [{ title: 'Taluka Reports', active: true }]}, canActivate: [ExpenseGuard] },
  { path: 'satisfied-report', loadChildren: () => import('../../partial/reports/satisfied-report/satisfied-report.module').then(m => m.SatisfiedReportModule), data: { breadcrumb: [{ title: 'Satisfied Reports', active: true }]}, canActivate: [ExpenseGuard] },
  { path: 'pendency-report', loadChildren: () => import('../../partial/reports/pendency-report/pendency-report.module').then(m => m.PendencyReportModule), data: { breadcrumb: [{ title: 'Pendency Reports', active: true }]}, canActivate: [ExpenseGuard] },
  { path: 'grievance-details/:id', loadChildren: () => import('../../web/grievance-details/grievance-details.module').then(m => m.GrievanceDetailsModule), data: { title: 'Grievance Details' }, canActivate: [ExpenseGuard]  },

  { path: 'samadhan-report', loadChildren: () => import('../../partial/reports/samadhan-report/samadhan-report.module').then(m => m.SamadhanReportModule),data: { title: 'Samadhan Report' }, canActivate: [ExpenseGuard]  },
];
