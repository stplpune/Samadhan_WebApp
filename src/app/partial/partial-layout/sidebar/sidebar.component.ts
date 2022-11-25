import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SidebarService } from './sidebar.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class SidebarComponent implements OnInit {
  menus:any = [];
  mouseOutFlag: boolean = false;

  constructor(public sidebarservice: SidebarService, private webStorage: WebStorageService) {
    // this.menus = sidebarservice.getMenuList();
   }

  ngOnInit(): void {
    var arr = new Array();
    arr = this.webStorage.getAllPageName();
    this.sideBarMenu(arr);
  }

  sideBarMenu(data: any){
    this.menus = [];
    let items = data.filter((x:any) => x.isSideBarMenu == true)
    items.forEach((item: any) => {
      let existing: any = this.menus.filter((v: any) => {
        return v.pageNameView == item.pageNameView;
      });
      if (existing.length) {
        let existingIndex: any = this.menus.indexOf(existing[0]);
        this.menus[existingIndex].pageURL = this.menus[existingIndex].pageURL.concat(item.pageURL);
        // this.menus[existingIndex].pageNameView = this.menus[existingIndex].pageNameView.concat(item.pageNameView);
        this.menus[existingIndex].pageName = this.menus[existingIndex].pageName.concat(item.pageName);
        // this.menus[existingIndex].menuIcon = this.menus[existingIndex].menuIcon.concat(item.menuIcon);
        this.menus[existingIndex].type = 'dropdown';
      } else {
        if (typeof item.pageNameView == 'string')
          item.pageURL = [item.pageURL];
          item.pageNameView = [item.pageNameView];
          item.pageName = [item.pageName];
          item.menuIcon = [item.menuIcon];
          this.menus.push(item);
      }
    });    
  }
  
  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  addActiveClass(len:any){
    if(len == 1){
      this.menus.map((element: any) => {
        element.active = false;
      });
    }
  }

  toggle(currentMenu:any) {
    if (currentMenu.type === 'dropdown') {
      this.menus.forEach((element:any) => {
        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          element.active = false;
        }
      });
    }
  }

  getState(currentMenu:any) {

    if (currentMenu.active) {
      return 'down';
    } else {
      return 'up';
    }
  }

  mouseLeave() {
    this.mouseOutFlag = true;
  }

  mouseOver(){
    this.mouseOutFlag = false;
  }

  hasBackgroundImage() {
    return this.sidebarservice.hasBackgroundImage;
  }
  
}
