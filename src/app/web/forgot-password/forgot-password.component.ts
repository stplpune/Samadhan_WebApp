import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/service/api.service';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  sendOTPForm!: FormGroup;
  verifyOTPForm!: FormGroup;
  sendOTPContainer: boolean = true;
  verifyOTPContainer: boolean = false;
  public timerFlag: boolean = true;
  timeLeft: number = 30;
  interval: any;
  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private common: CommonMethodService,
    private error: ErrorHandlerService,
    private router: Router,
    public validation: FormsValidationService) { }

  ngOnInit(): void {
    this.sendOTPForm = this.fb.group({
      MobileNo: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]]
    })

    this.verifyOTPForm = this.fb.group({
      otpA: ['', Validators.required],
      otpB: ['', Validators.required],
      otpC: ['', Validators.required],
      otpD: ['', Validators.required],
      otpE: ['', Validators.required],
    })
  }

  get f() { return this.sendOTPForm.controls; }

  get g() { return this.verifyOTPForm.controls; }

  sendOTP() {
    let formData = this.sendOTPForm.value;
    if (this.sendOTPForm.invalid) {
      return;
    } else {
      let obj = {
        "createdBy": 0,
        "modifiedBy": 0,
        "createdDate": new Date(),
        "modifiedDate": new Date(),
        "isDeleted": true,
        "id": 0,
        "mobileNo": formData.MobileNo,
        "otp": "",
        "pageName": "",
        "otpExpireDate": new Date(),
        "isUser": true
      }
      this.apiService.setHttp('post', 'samadhan/otptran', false, obj, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.common.matSnackBar(res.statusMessage, 1)
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
    let formData = this.sendOTPForm.value;
    let otp = this.verifyOTPForm.value.otpA + this.verifyOTPForm.value.otpB + this.verifyOTPForm.value.otpC + this.verifyOTPForm.value.otpD + this.verifyOTPForm.value.otpE
    if (this.verifyOTPForm.invalid) {
      return;
    } else {
      let obj = {
        "createdBy": 0,
        "modifiedBy": 0,
        "createdDate": new Date(),
        "modifiedDate": new Date(),
        "isDeleted": true,
        "id": 0,
        "mobileNo": formData.MobileNo,
        "otp": otp,
        "pageName": "",
        "otpExpireDate": new Date(),
        "isUser": true
      }

      this.apiService.setHttp('post', 'samadhan/otptran/VerifyOTP', false, obj, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.common.matSnackBar(res.statusMessage, 1)
          this.verifyOTPForm.reset();
          this.verifyOTPContainer = false;
          this.router.navigate(['/login']);
        }
        else {
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
}
