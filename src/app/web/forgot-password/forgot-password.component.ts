import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/core/service/api.service';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  hideNewPass: boolean = true;
  hideConfirmPass: boolean = true;
  sendOTPForm!: FormGroup;
  verifyOTPForm!: FormGroup;
  changePassword!: FormGroup;
  sendOTPContainer: boolean = true;
  verifyOTPContainer: boolean = false;
  changePassContainer: boolean = false;
  public timerFlag: boolean = true;
  timeLeft: number = 30;
  interval: any;
  verifyMobile:any;
  verifyUserName:any;
  langTypeName:any;
  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private common: CommonMethodService,
    private error: ErrorHandlerService,
    private router: Router,
    public validation: FormsValidationService,
    private commomMethod:CommonMethodService,
    private webStorageService:WebStorageService,
    public translate:TranslateService
  ) { }

  ngOnInit(): void {
    this.sendOTPForm = this.fb.group({
      // MobileNo: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]]
      userName: ['', [Validators.required, Validators.pattern(/^[A-za-z]{5}[0-9]{5}/)]],
    })

    this.verifyOTPForm = this.fb.group({
      // mobileNo: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      otpA: ['', Validators.required],
      otpB: ['', Validators.required],
      otpC: ['', Validators.required],
      otpD: ['', Validators.required],
      otpE: ['', Validators.required],
    })
    
    this.changePassword = this.fb.group({
      // userName: ['', [Validators.required, Validators.pattern(/^[A-za-z]{5}[0-9]{5}/)]],
      newPassword: ['', [Validators.required, Validators.pattern(this.validation.valPassword)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(this.validation.valPassword)]],
      // mobileNo: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]]
    })

    this.webStorageService.langNameOnChange.subscribe(message => {
      this.langTypeName = message;

     });
     let lang:any =sessionStorage.getItem('language');
     lang= lang? lang:"English";
     this.translate.use(lang);
  }

  get f() { return this.sendOTPForm.controls; }
  get v(){ return this.verifyOTPForm.controls;}

  get h() { return this.changePassword.controls; }

  sendOTP() {
    let formData = this.sendOTPForm.value;
    if (this.sendOTPForm.invalid) {
      return;
    } else {
      let obj = {
        "id": 0,
        "mobileNo": "",
        "userName":formData.userName,
        "otp": "",
        "pageName": "",
        "createdBy": 0,
        "userTypeId": 0
      }
      this.apiService.setHttp('PUT', 'samadhan/user-registration/ValidateUserName', false, obj, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.common.matSnackBar(res.statusMessage, 0)
          this.verifyMobile=res.responseData;
          this.verifyUserName=res.responseData1;
          this.sendOTPContainer = false;
          this.verifyOTPContainer = true;
          this.startTimer();
        }
        else {
          this.common.matSnackBar(res.statusMessage, 1)
        }
      }, (error: any) => {
        this.error.handelError(error.status);
      })
    }
  }

  verifyOTP() {
    let otp = this.verifyOTPForm.value.otpA + this.verifyOTPForm.value.otpB + this.verifyOTPForm.value.otpC + this.verifyOTPForm.value.otpD + this.verifyOTPForm.value.otpE
    if (this.verifyOTPForm.invalid) {
      return;
    } else {
      let obj = {
        "id": 0,
        "mobileNo": this.verifyMobile,
        "userName": "",
        "otp":otp,
        "pageName": "",
        "createdBy": 0,
        "userTypeId": 0
      }

      this.apiService.setHttp('POST', 'samadhan/user-registration/VerifyOTP', false, obj, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.common.matSnackBar(res.statusMessage, 0)
          // this.verifyOTPForm.reset();
          this.changePassContainer = true;
          this.verifyOTPContainer = false;
        }
        else {
          this.verifyOTPForm.reset();
          this.common.matSnackBar(res.statusMessage, 1)
        }
      }, (error: any) => {
        this.error.handelError(error.status);
      })
    }
  }
  startTimer() {
    this.timeLeft = 30;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.timerFlag = false;
      } else {
        this.timerFlag = true;
        clearInterval(this.interval);
      }
    }, 1000)
  }

  ChangePassword() {
    let formData = this.changePassword.value;
    // let changeform = this.changePassword.value;
    if (this.changePassword.invalid) {
      return;
    } else if (formData.newPassword != formData.confirmPassword) {
      // this.changePassword.controls['confirmPassword'].setErrors({ 'notMatched': true })
      this.commomMethod.matSnackBar('New password and confirm password does not match', 1);
      return;
    }

    
    let obj = {
      "userName": this.verifyUserName,
      "newPassword": formData.newPassword,
      "confirmPassword": formData.confirmPassword,
      "mobileNo": "",
    }

    this.apiService.setHttp('put', 'samadhan/user-registration/ForgotPassword?UserName=' + obj.userName + '&Password=' + obj.newPassword + '&NewPassword=' + obj.confirmPassword + '&MobileNo=' + obj.mobileNo, false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.common.matSnackBar(res.statusMessage, 0)
        this.changePassContainer = false;
        this.router.navigate(['/login']);
      }
      else {
        this.common.matSnackBar(res.statusMessage, 1)
      }
    }, (error: any) => {
      this.error.handelError(error.status);
    })
  }


  validationaddremove() {
    let formData = this.changePassword.value;
    if (formData.NewPassword == formData.ConfirmPassword) {
      this.changePassword.controls['confirmPassword'].updateValueAndValidity();
    }
  }
}


