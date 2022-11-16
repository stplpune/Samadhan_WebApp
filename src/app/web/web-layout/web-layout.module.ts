import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebLayoutRoutingModule } from './web-layout-routing.module';
import { WebLayoutComponent } from './web-layout.component';
import { WebHeaderComponent } from './web-header/web-header.component';
import { WebFooterComponent } from './web-footer/web-footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from 'src/app/core/theme/theme.module';


@NgModule({
  declarations: [
    WebLayoutComponent,
    WebHeaderComponent,
    WebFooterComponent
  ],
  imports: [
    CommonModule,
    WebLayoutRoutingModule,
    TranslateModule,
    FormsModule,
    ThemeModule
  ]
})
export class WebLayoutModule { }
