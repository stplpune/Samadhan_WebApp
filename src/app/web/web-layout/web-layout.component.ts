import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-web-layout',
  templateUrl: './web-layout.component.html',
  styleUrls: ['./web-layout.component.css']
})
export class WebLayoutComponent implements OnInit {
  hideHeader: boolean = true;
  hideFooter: boolean = true;
  curtainFlag:boolean = true;
  autoPlay = false;
  constructor(public router: Router) {
    if (this.router.url == '/login' || this.router.url == '/forgot-password' || this.router.url.includes('/grievance-details') || this.router.url.includes('/document-download-for-android')) {
      this.hideHeader = false;
      this.hideFooter = false;
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      if(event instanceof NavigationEnd) {
      if (event.url === '/login' || this.router.url == '/forgot-password' || this.router.url.includes('/grievance-details') || this.router.url.includes('/document-download-for-android') ) {
        this.hideHeader = false;
        this.hideFooter = false;
      } else {
        this.hideHeader = true;
        this.hideFooter = true;
      }
    }
    })
  }

  selCheckBox(event:any){
    this.autoPlay =true;
    // debugger

 let audioPlayer = <HTMLVideoElement> document.getElementById("myAudio");
     audioPlayer.play()
    if(!event?.target.checked){
      setTimeout(() => {
        this.curtainFlag =  event?.target.checked ;
      }, 7000);
    }
  }
}
