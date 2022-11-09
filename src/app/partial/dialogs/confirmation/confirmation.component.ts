import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonMethodService } from 'src/app/core/service/common-method.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  dialogData: any;
  constructor( public commonService: CommonMethodService,
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.dialogData = this.data;
  }

  onNoClick(flag: any): void {
    if (flag == "Yes") {
        let obj = {
          flag: flag,
        }
        this.dialogRef.close(obj)
      }
      this.dialogRef.close(flag);
   }
}
