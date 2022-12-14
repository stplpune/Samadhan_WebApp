import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/service/api.service';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { FileUploadService } from 'src/app/core/service/file-upload.service';
import { FormsValidationService } from 'src/app/core/service/forms-validation.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileData:any;
  profileFrom!:FormGroup;
  getImgExt:any;
  file: any;
  ImgUrl: any;
  selectedFile:any;
  subscription!:Subscription;
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;
  @ViewChild('fileInput') fileInput!: ElementRef;
  profileImg: any;
  langTypeName:any;
  selectedLang:any;
  constructor(
    private apiService:ApiService,
    private commonService:CommonMethodService,
    private localstorageService:WebStorageService,
    private errorSerivce:ErrorHandlerService,
    private fb:FormBuilder,
    public validation:FormsValidationService,
    private error:ErrorHandlerService,
    private uploadFilesService:FileUploadService,
    public dialogRef: MatDialogRef<ProfileComponent>,
    public translate:TranslateService
  ) { }

  localstorageData :any =this.localstorageService.getLoggedInLocalstorageData();
  loginObj: any = this.localstorageService.getLoggedInLocalstorageData()?.responseData;

  ngOnInit(): void {
    this.defaultForm();
    this.getUserRegistration();
    this.localstorageService.langNameOnChange.subscribe(message => {
      this.langTypeName = message;
     });
   
  }

  translateLanguageTo(lang: any) {
    this.selectedLang = lang;
    sessionStorage.setItem('language', lang);
    this.translate.use(lang);
  }

  defaultForm(){
    this.profileFrom=this.fb.group({
      name:['',[Validators.required,Validators.pattern(this.validation.valName)]],
      mobileNo:['',[Validators.required,Validators.pattern(this.validation.valMobileNo), Validators.minLength(10), Validators.maxLength(10)]],
      emailId:['',[Validators.required,Validators.pattern(this.validation.valEmailId)]],
      profilePhoto:['']
    })
  }

  get f(){
    return this.profileFrom.controls;
  }

  getUserRegistration() {
    this.apiService.setHttp('get', "samadhan/user-registration/" + this.localstorageService.getUserId(), false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.profileData = res.responseData;
          this.commonService.checkDataType(this.profileData?.profilePhoto) === '' && this.commonService.checkDataType(this.profileData) == true ? this.ImgUrl = 'assets/images/user.png' : this.ImgUrl = this.profileData?.profilePhoto;
          this.profileFormPatchValue(this.profileData);
        } else {
          this.profileData = [];
          this.commonService.checkDataType(res.statusMessage) == false ? this.errorSerivce.handelError(res.statusCode) : this.commonService.matSnackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.errorSerivce.handelError(error.status) })
    });
  }

  profileFormPatchValue(data:any){
     this.profileFrom.patchValue({
      name:data.name,
      mobileNo:data.mobileNo,
      emailId:data.emailId, 
      profilePhoto:data.profilePhoto  
     })
  }

  openInputFile() {
    let clickInputFile = document.getElementById("img-upload");
    clickInputFile?.click();
  }

  documentUpload(event: any) {
    this.file = event;
    let selResult: any = event.target.value.split('.');
    let getImgExt = selResult.pop();
    getImgExt.toLowerCase();
    if (getImgExt == "png" || getImgExt == "jpg" || getImgExt == "jpeg") {
      this.selectedFile = <File>event.target.files[0];
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.ImgUrl = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        this.ImgUrl = event.target.files[0].name;
      }
    }
    else {
      this.commonService.matSnackBar("Profile image allowed only jpg or png format", 1);
    }

  }

  deleteImg() {
    this.file = "";
    this.ImgUrl = '';
    this.fileInput.nativeElement.value = '';
    this.profileFrom.controls['profilePhoto'].setValue('');
  }

  onSubmit(){
    if(this.profileFrom.invalid){
      return
    }
    this.file ? this.fileUploaded() : this.updateProfile();
  }

  updateProfile(){
    let formValue=this.profileFrom.value;
   
    console.log(formValue);
    let obj={
      "id": this.localstorageService.getLoggedInLocalstorageData()?.responseData.id,
      "name": formValue.name,
      "mobileNo": formValue.mobileNo,     
      "emailId": formValue.emailId,
      "profilePhoto": this.commonService.checkDataType(formValue.profilePhoto) == false ? '' : formValue.profilePhoto,
      "modifiedBy": this.loginObj.modifiedBy,    
      "modifiedDate": new Date(),    
    }
   
    this.apiService.setHttp('PUT', "samadhan/user-registration/UpdateProfile", false, obj, false, 'samadhanMiningService');
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.closeDialog();
          this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.matSnackBar(res.statusMessage, 0);
        } else {
          this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.matSnackBar(res.statusMessage, 1);
        }
        // this.spinner.hide();
      },
      error: ((error: any) => { this.error.handelError(error.status); })
    })
  }

  fileUploaded() {
    let documentUrl: any = this.uploadFilesService.uploadDocuments(this.file, "profile", "png,jpg,jpeg", 5, 5000);
    documentUrl.subscribe((ele: any) => {
      if (ele.statusCode == '200') {
        if (ele == 'error') {
          this.fileInput.nativeElement.value = '';
        }
         this.profileFrom.controls['profilePhoto'].setValue(ele.responseData);
        this.updateProfile();
      } else {
        this.commonService.matSnackBar('Profile img is not uploaded', 1)
        this.updateProfile();
      }

    })
  }

  closeDialog() {
    this.dialogRef.close('Yes');
  }

  ClearAll() {
    this.formGroupDirective.resetForm();
    this.dialogRef.close();
  }

}
