import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  toggled = false;
  _hasBackgroundImage = true;
  menus = [
    {
      title: 'assets',
      type: 'header'
    },
    {
      title: 'Master',
      url:'assets-dashboard',
      icon: 'fa-solid fa-chart-line',
      type: 'simple'
    },
    {
      title: 'Department',
      icon: 'fa fa-book',
      active: false,
      type: 'simple'
    },
    {
      title: 'Office',
      icon: 'fa fa-calendar',
      active: false,
      type: 'simple'
    },
    {
      title: 'User Registration',
      icon: 'fa fa-folder',
      active: false,
      type: 'simple'
    },
    {
      title: 'Grievance Master',
      icon: 'fa fa-folder',
      active: false,
      type: 'simple'
    },
    {
      title: 'Post Grievance',
      icon: 'fa fa-folder',
      active: false,
      type: 'simple'
    }
  ];
  constructor() { }

  toggle() {
    this.toggled = ! this.toggled;
  }

  getSidebarState() {
    return this.toggled;
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
  }

  getMenuList() {
    return this.menus;
  }

  get hasBackgroundImage() {
    return this._hasBackgroundImage;
  }

  set hasBackgroundImage(hasBackgroundImage) {
    this._hasBackgroundImage = hasBackgroundImage;
  }
}
