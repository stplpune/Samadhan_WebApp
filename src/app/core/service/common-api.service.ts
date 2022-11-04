import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CommonMethodService } from './common-method.service';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {
  stateArray: any[] = [];
  districtArray: any[] = [];
  divisionArray:any[]=[];
  talukaArray:any[]=[];
  villageArray:any[]=[];
  otp:any;
  verify:any;
  constructor(
    private apiService:ApiService,
    private commonMethod:CommonMethodService
  ) { }

  getState() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/Master/GetAllState", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.stateArray = res.responseData; obj.next(this.stateArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getDistrict() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/Master/GetAllDistrict", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.districtArray = res.responseData; obj.next(this.districtArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getDivision() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/Master/GetAllDivision", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.divisionArray = res.responseData; obj.next(this.divisionArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getTaluka() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/Master/GetAllTaluka", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.talukaArray = res.responseData; obj.next(this.talukaArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getVillage() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/Master/GetAllVillage", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.villageArray = res.responseData; obj.next(this.villageArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }



  
}
