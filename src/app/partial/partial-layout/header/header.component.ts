import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { ChangePasswordComponent } from '../../dialogs/change-password/change-password.component';
import { LogoutComponent } from '../../dialogs/logout/logout.component';
import { ProfileComponent } from '../../dialogs/profile/profile.component';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  selectedLanguage: any;

  selLag = ['English','Marathi'];

  constructor(public sidebarservice: SidebarService,
    public dialog: MatDialog,
    public webStorageService:WebStorageService,
    private router:Router,
    public translate: TranslateService) { }
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
  title: any;
  ngOnInit(): void {
    this.translateLanguageTo(sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English');
  }

  openChangePasswordModal() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '650px',
      data: '',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((_result: any) => {
    });
  }

  openProfileModal() {
    const dialogRef = this.dialog.open(ProfileComponent, {
      width: '650px',
      data: '',
    });
    dialogRef.afterClosed().subscribe((_result: any) => {
    });
  }

  logOut() {
    const dialogRef = this.dialog.open(LogoutComponent, {
      width: '350px',
      data: '',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.localStorageClear();
      }
    });
  }

  translateLanguageTo(lang: any) {
    this.selectedLanguage = lang;
    sessionStorage.setItem('language', lang);
    this.translate.use(lang);
    this.webStorageService.sendlangType(lang);
  }

  localStorageClear() {
    localStorage.clear();
    this.router.navigate(['../home']);
    sessionStorage.clear();
  }

}
