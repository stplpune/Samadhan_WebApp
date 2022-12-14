import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  langTypeName:any;
  selectedLang:any;
  constructor(private router:Router,
    public dialogRef: MatDialogRef<LogoutComponent>,
    private webstorageService:WebStorageService,
    public translate:TranslateService) { }

  ngOnInit(): void {
    this.webstorageService.langNameOnChange.subscribe(message => {
      this.langTypeName = message;
     });
  }

  translateLanguageTo(lang: any) {
    this.selectedLang = lang;
    sessionStorage.setItem('language', lang);
    this.translate.use(lang);
  }

  logOut(){
    sessionStorage.clear();
    this.router.navigate(['login']);
    this.dialogRef.close();
  }

  closeModal(flag?: any) {
    this.dialogRef.close(flag);
  }

}
