import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, _MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/core/service/api.service';
import { CommonMethodService } from 'src/app/core/service/common-method.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { ChartComponent } from "ng-apexcharts"

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  title: ApexTitleSubtitle
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['srNo', 'department', 'totalGrievances', 'open','accepted','resolved','rejected'];
  dataSource:any;
  data:any;
  pageNumber:number=1;
  totalGrievance:any;
  percentages=new Array();
  departmants=new Array();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("chart") chart!: ChartComponent
  public chartOptions!: Partial<ChartOptions> | any;
  constructor(
    private apiService:ApiService,
    private commonMethod:CommonMethodService,
    private error:ErrorHandlerService

  ) {}

  ngOnInit(): void {
    this.getData();
    this.bindTable();
    this.getChart();
    this.getChartData();
  }

  getData() {
    this.apiService.setHttp('get', "api/DashboardWeb/GetAll", false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.data = res.responseData; 
        } else {
          this.dataSource = []
          if (res.statusCode != "404") {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  bindTable() {
    this.apiService.setHttp('get', "api/DashboardWeb/StatusWiseGrievanceReceived", false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.dataSource=new MatTableDataSource(res.responseData.responseData1); 
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = []
          if (res.statusCode != "404") {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  getChartData(){
    this.apiService.setHttp('get', "api/DashboardWeb/TotalGrievancesReceived", false, false, false, 'samadhanMiningService');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.totalGrievance=res.responseData; 
          this.departmants= this.totalGrievance.map((ele:any)=> ele['name']);  
          this.percentages=this.totalGrievance.map((ele:any)=> ele.percentage); 
          this.getChart(); 
        } else {
          if (res.statusCode != "404") {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.matSnackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  getChart(){
    this.chartOptions = {
      series: this.percentages,  
      plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,                       
                    total: {
                        show: true,
                        showAlways: true,
                        label: 'Total Grievance',                           
                        formatter: function (series:any) {
                          return series.globals.seriesTotals.reduce((a:any, b:any) => {
                            return a + b
                          }, 0)
                        }
                    }
                }                   
            }
        }
    },             
      chart: {
        width: 380,
        type: "donut",
      },
      labels: this.departmants,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
               position: "bottom",
            }
          }
        }
      ]
    };
  }

  
}


