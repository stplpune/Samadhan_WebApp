import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-web-header',
  templateUrl: './web-header.component.html',
  styleUrls: ['./web-header.component.css']
})
export class WebHeaderComponent implements OnInit {

  selectedLanguage: any = 'English';

  constructor(
    public translate: TranslateService) {
    translate.addLangs(['English', 'Marathi']);
  }

  ngOnInit(): void {
    this.translateLanguageTo(sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English');
  }

  translateLanguageTo(lang: any) {
    this.selectedLanguage = lang;
    sessionStorage.setItem('language', lang);
    this.translate.use(lang);
  }

}
