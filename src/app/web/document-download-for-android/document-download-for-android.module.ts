import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentDownloadForAndroidRoutingModule } from './document-download-for-android-routing.module';
import { DocumentDownloadForAndroidComponent } from './document-download-for-android.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    DocumentDownloadForAndroidComponent
  ],
  imports: [
    CommonModule,
    DocumentDownloadForAndroidRoutingModule,
    TranslateModule
  ]
})
export class DocumentDownloadForAndroidModule { }
