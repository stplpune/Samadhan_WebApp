import { RouterModule, Routes } from '@angular/router';

export const PartialLayoutRoutes: Routes = [
  { path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule), data: { title: 'Dashboard' } },
  { path: 'department-master', loadChildren: () => import('../../partial/department-master/department-master.module').then(m => m.DepartmentMasterModule) },
  { path: 'office-master', loadChildren: () => import('../../partial/office-master/office-master.module').then(m => m.OfficeMasterModule) },
  { path: 'user-registration', loadChildren: () => import('../../partial/user-registration/user-registration.module').then(m => m.UserRegistrationModule) },
  { path: 'grievance-master', loadChildren: () => import('../../partial/grievance-master/grievance-master.module').then(m => m.GrievanceMasterModule) },
  { path: 'post-grievance', loadChildren: () => import('../../partial/post-grievance/post-grievance.module').then(m => m.PostGrievanceModule) },
  { path: 'page-list', loadChildren: () => import('../../partial/page-list/page-list.module').then(m => m.PageListModule) },
  { path: 'user-right-access', loadChildren: () => import('../../partial/user-right-access/user-right-access.module').then(m => m.UserRightAccessModule) },
];
