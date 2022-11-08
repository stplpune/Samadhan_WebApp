import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/core/service/api.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service'
import { CommonMethodService } from 'src/app/core/service/common-method.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  hide = true;
  loginData: any;
  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private error: ErrorHandlerService,
    private common: CommonMethodService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(/^(((?=.*[a-z])(?=.*[A-Z]))((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,8})/)]],
      captcha: ['', [Validators.required]]
    })
    this.captcha();
    this.onSubmit()
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.loginData = this.loginForm.value;
      console.log(this.loginForm.value);
      this.apiService.setHttp('get', 'samadhan/user-registration/' + this.loginData.username.trim()+'/'+this.loginData.password.trim(), false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          alert(res.statusMessage)
          console.log(res);
          sessionStorage.setItem('loggedIn', 'true');
          localStorage.setItem('loggedInData', JSON.stringify(res));
          this.router.navigate(['../dashboard'])
        }
        else {
          alert(res.statusMessage)
        }
      }, (error: any) => {
        this.error.handelError(error.status);
      })
    }else if (this.loginForm.value.captcha !=  this.common.checkvalidateCaptcha()){
      // this.common.snackBar("Invalid Captcha", 1)
      }

  }

  captcha() {
    this.loginForm.controls['captcha'].reset();
    this.common.createCaptchaCarrerPage();
    sessionStorage.clear();
  }

  togglePasswordVisibility(){
    this.hide=!this.hide;
  }


}


