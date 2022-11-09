import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class CommonApiService {
  stateArray: any[] = [];
  districtArray: any[] = [];
  divisionArray:any[]=[];
  talukaArray:any[]=[];
  villageArray:any[]=[];
  statusArray:any[]=[];
  officeArray:any[]=[];
  departmentArray:any[]=[];
  otp:any;
  verify:any;
  constructor(
    private apiService:ApiService,
    
  ) { }

  getAllState() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetAllState", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.stateArray = res.responseData; obj.next(this.stateArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getAllDistrict() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetAllDistrict", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.districtArray = res.responseData; obj.next(this.districtArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getAllDivision() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetAllDivision", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.divisionArray = res.responseData; obj.next(this.divisionArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getAllTaluka() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetAllTaluka", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.talukaArray = res.responseData; obj.next(this.talukaArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getAllVillage() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetAllVillage", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.villageArray = res.responseData; obj.next(this.villageArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getAllStatus() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetAllStatus", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.statusArray = res.responseData; obj.next(this.statusArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getAllOffice() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetAllOffice", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.officeArray = res.responseData; obj.next(this.officeArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getAllDepartment() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetAllDepartment", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.departmentArray = res.responseData; obj.next(this.departmentArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }





  
}
