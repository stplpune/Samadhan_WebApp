import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from 'src/app/core/theme/theme.service';

@Component({
  selector: 'app-web-header',
  templateUrl: './web-header.component.html',
  styleUrls: ['./web-header.component.css']
})
export class WebHeaderComponent implements OnInit {

  selectedLanguage: any = 'English';
  activeTheme: any;

  constructor(@Inject(DOCUMENT) private document: any,
    private ThemeService: ThemeService,
    public translate: TranslateService) {
    translate.addLangs(['English', 'Marathi']);
  }

  ngOnInit(): void {
    this.translateLanguageTo(sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English');
    sessionStorage.getItem('theme') ? this.onClickThemeChange(sessionStorage.getItem('theme')) : this.onClickThemeChange('main');
    this.ThemeService.getActiveTheme().subscribe(x => {
      this.activeTheme = x
    });
  }

  translateLanguageTo(lang: any) {
    this.selectedLanguage = lang;
    sessionStorage.setItem('language', lang);
    this.translate.use(lang);
  }

  skipToMainContent(){
    let element: any = document.getElementById('about-us')
    element.setAttribute('tabindex','-1');
    element.focus()
  }

  onChangeFontSize(value:any){
    if(value == 'sm'){
      this.document.body.style.fontSize = '0.8rem';
    }else if(value == 'md'){
      this.document.body.style.fontSize = '0.85rem';
    }else{
      this.document.body.style.fontSize = '0.9rem';
    }
  }

  onClickThemeChange(themeName: any): void {
    sessionStorage.setItem('theme', themeName);
    this.ThemeService.setActiveThem(themeName);
    this.activeTheme = themeName;
  }

}
