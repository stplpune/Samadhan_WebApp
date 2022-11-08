import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { MatNativeDateModule,  MAT_DATE_LOCALE } from '@angular/material/core';
import { PartialLayoutComponent } from './partial/partial-layout/partial-layout.component';
import { FooterComponent } from './partial/partial-layout/footer/footer.component';
import { HeaderComponent } from './partial/partial-layout/header/header.component';
import { SidebarComponent } from './partial/partial-layout/sidebar/sidebar.component';
import { MaterialModule } from './shared/AngularMaterialModule/material.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChangePasswordComponent } from './partial/dialogs/change-password/change-password.component';
import { ConfirmationComponent } from './partial/dialogs/confirmation/confirmation.component';
import { LogoutComponent } from './partial/dialogs/logout/logout.component';
import { SuccessComponent } from './partial/dialogs/success/success.component';
import { ProfileComponent } from './partial/dialogs/profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    AppComponent,
    PartialLayoutComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ChangePasswordComponent,
    ConfirmationComponent,
    LogoutComponent,
    SuccessComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    HttpClientModule,
    NgxSpinnerModule,
    MatIconModule
  ],
  providers: [ Title,
       { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
