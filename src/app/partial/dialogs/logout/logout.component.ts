import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router:Router,
    public dialogRef: MatDialogRef<LogoutComponent>,) { }

  ngOnInit(): void {
  }

  logOut(){
    sessionStorage.clear();
    this.router.navigate(['login']);
    this.dialogRef.close();
  }

  closeModal(flag?: any) {
    this.dialogRef.close(flag);
  }

}
