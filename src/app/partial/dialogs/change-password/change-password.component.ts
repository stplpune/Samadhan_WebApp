import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroupDirective, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/service/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service'
import { Router } from '@angular/router';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  hide = true;
  hide1 = true;
  hide2 = true;
  changePasswordFrm!: FormGroup
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;
  localstorageData = this.webstorageService.getLoggedInLocalstorageData();
  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private fb: FormBuilder,
    private apiService: ApiService,
    public spinner: NgxSpinnerService,
    private error: ErrorHandlerService,
    private webstorageService: WebStorageService,
    private router: Router,
    private common: CommonMethodService,
    public validation: FormsValidationService) { }

  ngOnInit(): void {
    this.changePasswordFrm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.pattern(this.validation.valPassword)]],
      newPassword: ['', [Validators.required, Validators.pattern(this.validation.valPassword)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(this.validation.valPassword)]],
    })
  }

  get f() {
    return this.changePasswordFrm.controls;
  }
  onSubmit() {
    debugger
    let formData = this.changePasswordFrm.value;
    if (this.changePasswordFrm.invalid) {
      return;
    } else if (formData.newPassword.trim() != formData.confirmPassword.trim()) {
      this.changePasswordFrm.controls['confirmPassword'].setErrors({ 'notMatched': true })
      return;
    } else if (formData.oldPassword == formData.newPassword && (this.common.checkDataType(formData.oldPassword) == true && this.common.checkDataType(formData.newPassword) == true)) {
      this.changePasswordFrm.controls['confirmPassword'].setErrors({ 'Matched': true });
      return;
    }

    let obj = {
      "OldPassword": formData.oldPassword,
      "UserName": this.localstorageData.responseData.userName,
      "Password": formData.newPassword,
      "MobileNo": this.localstorageData.responseData.mobileNo,
    }
    // console.log(this.changePasswordFrm.value);
    this.apiService.setHttp('put', 'samadhan/user-registration/UpdatePassward?OldPassword=' + obj.OldPassword + '&UserName=' + obj.UserName + '&Password=' + obj.Password + '&MobileNo=' + obj.MobileNo, false, obj, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        // console.log(res);
        if (res.statusCode == "200") {
          this.spinner.hide();
          this.common.matSnackBar(res.statusMessage, 0);
          localStorage.removeItem('loggedInData');
          sessionStorage.removeItem('loggedIn');
          this.router.navigate(['/home']);
          this.ClearAll();

        } else {
          this.spinner.hide();
          this.common.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.matSnackBar(res.statusMessage, 1);

        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    })


  }

  closeDialog() {
    this.dialogRef.close('Yes');
  }

  ClearAll() {
    this.formGroupDirective.resetForm();
    // this.dialogRef.close();
  }

}
