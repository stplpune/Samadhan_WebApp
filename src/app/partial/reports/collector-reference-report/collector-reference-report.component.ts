
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { CommonApiService } from 'src/app/core/service/common-api.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';

@Component({
  selector: 'app-collector-reference-report',
  templateUrl: './collector-reference-report.component.html',
  styleUrls: ['./collector-reference-report.component.css']
})
export class CollectorReferenceReportComponent implements OnInit {
  filterForm!: FormGroup;
  talukaArray = new Array();
  departmentArray = new Array();
  officeArray = new Array();
  subOfficeArray = new Array();
  todayDate = new Date();
  pageNo = 1;
  @ViewChild('formDirective') formDirective!: NgForm;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonApiService,
    public error: ErrorHandlerService,
  ) { }

  ngOnInit(): void {
    this.filterform();
    this.getDepartment();
    this.getTaluka(1);
  }


  filterform() {
    this.filterForm = this.fb.group({
      searchdeptId: ['0'],
      searchofcId: ['0'],
      subofcId: ['0'],
      fromDate: [''],
      toDate: ['']
    })
  }

  getTaluka(distId: number) {
    if (distId == 0) {
      return;
    }
    this.talukaArray = [];
    this.commonService.getTalukabyDistId(distId).subscribe({
      next: (response: any) => {
        this.talukaArray.push(...response);
      },
      error: ((error: any) => { this.error.handelError(error.statusCode) })
    })
  }

  getDepartment() {
    this.departmentArray = [];
    this.commonService.getAllDepartment().subscribe({
      next: (response: any) => {
        this.departmentArray.push(...response);
      },
      error: (() => {
        this.departmentArray = [];
      })
    })
  }

  getOffice(deptNo: number) {
    if (deptNo == 0) {
      return;
    }
    this.officeArray = [];
    this.commonService.getOfficeByDeptId(deptNo).subscribe({
      next: (response: any) => {
        this.officeArray.push(...response);
      },
      error: (() => { this.officeArray = []; })
    })
  }

  getSubOffice(officeId: number) {
    if (officeId == 0) {
      return;
    }
    this.subOfficeArray = [];
    this.commonService.getAllSubOfficeByOfficeId(officeId).subscribe({
      next: (response: any) => {
        this.subOfficeArray.push(...response);
      },
      error: (() => { this.subOfficeArray = [] })
    })
  }

  clearFilter() {
    this.formDirective.resetForm();
  }

}
