import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { SidebarService } from './sidebar/sidebar.service';

@Component({
  selector: 'app-partial-layout',
  templateUrl: './partial-layout.component.html',
  styleUrls: ['./partial-layout.component.css']
})
export class PartialLayoutComponent implements OnInit {

  breadcrumbs:any;
  selectedLang: any
  constructor(public sidebarservice: SidebarService, private router:Router,private activatedRoute:ActivatedRoute) {  this.addBreadcrumbs();}
  toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }
  toggleBackgroundImage() {
    this.sidebarservice.hasBackgroundImage = !this.sidebarservice.hasBackgroundImage;
  }
  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  hideSidebar() {
    this.sidebarservice.setSidebarState(true);
  }
  ngOnInit(): void {
    this.selectedLang = sessionStorage.getItem('language')
  }

  addBreadcrumbs() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).pipe(map(() => this.activatedRoute))
      .pipe(map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }))
      .pipe(filter(route => route.outlet === PRIMARY_OUTLET))
      .subscribe(route => {

        let snapshot = this.router.routerState.snapshot;
        this.breadcrumbs = [];
        let url = snapshot.url;
        let routeData = route.snapshot.data;
        let label = routeData['breadcrumb'];
        let params = snapshot.root.params;

        this.breadcrumbs.push({
          url: url,
          label: label,
          params: params
        });
      });
  }

}
