import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentDownloadForAndroidComponent } from './document-download-for-android.component';

const routes: Routes = [{ path: '', component: DocumentDownloadForAndroidComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentDownloadForAndroidRoutingModule { }
