import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebStorageService {

  constructor() { }

  checkUserIsLoggedIn() { // check user isLoggedIn or not
    let sessionData: any = sessionStorage.getItem('loggedIn');
    sessionData == null || sessionData == '' ? localStorage.clear() : '';
    if (localStorage.getItem('loggedInData') && sessionData == 'true') return true;
    else return false;
  }

  getLoggedInLocalstorageData() {
    if (this.checkUserIsLoggedIn() == true) {
      let data = JSON.parse(localStorage['loggedInData']);
      return data;
    }
  }

  getUserId(){
    let data =this.getLoggedInLocalstorageData();
    return data.responseData.id
  }

  getSubUserType(){
    let data =this.getLoggedInLocalstorageData();
    return data.responseData?.subUserTypeId
  }

  getAllPageName() {
    if (this.checkUserIsLoggedIn() == true) {
      let getAllPageName = this.getLoggedInLocalstorageData();      
      return getAllPageName?.responseData?.pageLstModels;
    }
  }

  redirectToDashborad() {
    if (this.checkUserIsLoggedIn() == true) {
      let logInUserType: any = this.getAllPageName();
      let redirectToDashboard = logInUserType[0].pageURL;
      return redirectToDashboard;
    }
  }

getUserName(){
  let userName = this.getLoggedInLocalstorageData().responseData?.userName;
  return userName;
}

private langName = new BehaviorSubject('');
langNameOnChange = this.langName.asObservable();

sendlangType(type: string) {
    this.langName.next(type);
}


}
