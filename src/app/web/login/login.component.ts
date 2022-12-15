import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/service/api.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service'
import { CommonMethodService } from 'src/app/core/service/common-method.service'
import { Router } from '@angular/router';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide: boolean = true;
  loginData: any;
  langTypeName:any;
  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private error: ErrorHandlerService,
    private common: CommonMethodService,
    private router: Router,
    public validation: FormsValidationService,public webStorageService:WebStorageService,public translate: TranslateService
  ) {
   }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[A-za-z]{5}[0-9]{5}/)]],
      password: ['', [Validators.required, Validators.pattern(this.validation.valPassword)]],
      captcha: ['', [Validators.required, Validators.pattern(this.validation.onlyNumbers)]]
    })
    this.webStorageService.langNameOnChange.subscribe(message => {
      this.langTypeName = message;

     });
     let lang:any =sessionStorage.getItem('language');
     lang= lang? lang:"English";
     this.translate.use(lang);

    this.captcha();
  }

  get f() {return this.loginForm.controls;}

  onSubmit() {
    this.loginData = this.loginForm.value;
    if (this.loginForm.invalid) {
      return;
    } else if (this.loginForm.value.captcha != this.common.checkvalidateCaptcha()) {
      this.common.matSnackBar("Invalid Captcha", 1)
      return;
    } else if (this.loginForm.valid) {
      this.apiService.setHttp('get', 'samadhan/user-registration/' + this.loginData.username.trim() + '/' + this.loginData.password.trim(), false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          // this.common.matSnackBar(res.statusMessage, 0);
          sessionStorage.setItem('loggedIn', 'true');
          localStorage.setItem('loggedInData', JSON.stringify(res));
          this.router.navigate(['../dashboard'])
        }
        else {
          this.common.matSnackBar(res.statusMessage, 1)
        }
      }, (error: any) => {
        this.error.handelError(error.status);
      })
    }
  }

  captcha() {
    this.loginForm.controls['captcha'].reset();
    this.common.createCaptchaCarrerPage();
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }
}


