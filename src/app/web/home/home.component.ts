import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/service/api.service';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { WebStorageService } from 'src/app/core/service/web-storage.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  data:any;
  langTypeName:any;

  constructor(
    private apiService:ApiService,
    private commonMethod:CommonMethodService,
    private error:ErrorHandlerService,   
    private webStorageService:WebStorageService, 
  ) { }

  ngOnInit(): void {
    this.getData();
    this.webStorageService.langNameOnChange.subscribe(message => {
     this.langTypeName = message;
    });

  }


  getData() {
    this.apiService.setHttp('get', "api/DashboardWeb/GetAll?userid=" + 1 , false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.data = res.responseData; 
        } else {
          if (res.statusCode != "404") {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

}
