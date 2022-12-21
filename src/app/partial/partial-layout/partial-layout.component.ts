import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { SidebarService } from './sidebar/sidebar.service';

@Component({
  selector: 'app-partial-layout',
  templateUrl: './partial-layout.component.html',
  styleUrls: ['./partial-layout.component.css']
})
export class PartialLayoutComponent implements OnInit {

  breadcrumbs:any;
  selectedLang: any
  constructor(public sidebarservice: SidebarService, private router:Router,private activatedRoute:ActivatedRoute,
    private webStorage:WebStorageService ) {  this.addBreadcrumbs();}
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
    // this.selectedLang = sessionStorage.getItem('language')
    this.webStorage.langNameOnChange.subscribe(message => {
      this.selectedLang = message;
     });
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
        if(url.includes('samadhan-report')){
          let urlData=url.split('/');
          let pageId=urlData[2].split('.');
          pageId[2] =='1' ?  (label[0].title='Depratment Reports',label[0].titleMarathi='विभाग अहवाल') : '';
          pageId[2] =='2' ?  (label[0].title='Office Reports',label[0].titleMarathi='कार्यालय अहवाल') : '';
          pageId[2] =='3' ?  (label[0].title='Taluka Reports',label[0].titleMarathi='तालुका अहवाल') : '';
          pageId[2] =='4' ?  (label[0].title='Satisfied Reports',label[0].titleMarathi='समाधानी अहवाल') : '';
          pageId[2] =='5' ?  (label[0].title='Pendency Reports',label[0].titleMarathi='प्रलंबित अहवाल') : '';
        }
        console.log(label)
        let params = snapshot.root.params;
        this.breadcrumbs.push({
          url: url,
          label: label,
          params: params
        });
      });
  }

}
