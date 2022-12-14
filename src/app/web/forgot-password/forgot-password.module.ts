import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { MaterialModule } from 'src/app/shared/AngularMaterialModule/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class ForgotPasswordModule { }
