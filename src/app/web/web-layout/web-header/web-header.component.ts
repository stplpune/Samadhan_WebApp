import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-web-header',
  templateUrl: './web-header.component.html',
  styleUrls: ['./web-header.component.css']
})
export class WebHeaderComponent implements OnInit {

  selectedLanguage: any = 'English';

  constructor(@Inject(DOCUMENT) private document: any,
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

  onChangeFontSize(value:any){
    if(value == 'sm'){
      this.document.body.style.fontSize = '0.8rem';
    }else if(value == 'md'){
      this.document.body.style.fontSize = '0.85rem';
    }else{
      this.document.body.style.fontSize = '0.9rem';
    }
  }

}
