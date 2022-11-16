import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class CommonApiService {
  usersArray=new Array();
  subUsersArray=new Array();
  stateArray=new Array();
  districtArray=new Array();
  divisionArray=new Array();
  talukaArray=new Array();
  villageArray=new Array();
  statusArray=new Array();
  officeArray=new Array();
  departmentArray=new Array();
  officeByDept=new Array();
  villageByTaluka=new Array();
  talukaByDistrict=new Array();
  natureGrievance=new Array();
  natureGrievanceByDept=new Array();
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


  getOfficeByDeptId(deptId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetOfficeByDeptId?DeptId=" + deptId, false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { this.officeByDept = res.responseData; obj.next(this.officeByDept); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })

    })
  }

  getVillageByTalukaId(talukaId:number){
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetVillageByTalukaId?TalukaId=" + talukaId, false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { this.villageByTaluka = res.responseData; obj.next(this.villageByTaluka); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })

    })
  }

  getTalukabyDistId(districtId:number){
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetTalukabyDistId?DistrictId=" + districtId, false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { this.talukaByDistrict = res.responseData; obj.next(this.talukaByDistrict); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })

    })

  }

  getAllNatureOfGrievance(){
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetAllNatureOfGrievance", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { this.natureGrievance = res.responseData; obj.next(this.natureGrievance); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })

    })

  }

  getAllUser() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetAllUserType", false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.usersArray = res.responseData; obj.next(this.usersArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getAllNatureOfGrievanceByDeptId(deptId:number){
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetAllNatureOfGrivanceByDeptId?DeptId=" + deptId, false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { this.natureGrievanceByDept = res.responseData; obj.next(this.natureGrievanceByDept); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })

    })
  }

  getAllSubUser(UserTypeId:number) {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "samadhan/commondropdown/GetAllSubUserTypeByUserTypeId?UserTypeId=" + UserTypeId, false, false, false, 'samadhanMiningService');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == 200) { this.subUsersArray = res.responseData; obj.next(this.subUsersArray); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }




  
}
