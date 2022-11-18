import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-web-layout',
  templateUrl: './web-layout.component.html',
  styleUrls: ['./web-layout.component.css']
})
export class WebLayoutComponent implements OnInit {
  hideHeader: boolean = true;
  hideFooter: boolean = true;

  constructor(private router: Router) {
    if (this.router.url == '/login' || this.router.url == '/forgot-password' || this.router.url == '/grievance-details') {
      this.hideHeader = false;
      this.hideFooter = false;
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      if (event.url === '/login' || this.router.url == '/forgot-password' || this.router.url == '/grievance-details') {
        this.hideHeader = false;
        this.hideFooter = false;
      } else {
        this.hideHeader = true;
        this.hideFooter = true;
      }
    })
  }

}
