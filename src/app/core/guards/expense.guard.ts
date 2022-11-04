import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { WebStorageService } from '../service/web-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseGuard implements CanActivate {
  constructor(private webStorage: WebStorageService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let urlSplit: any = route.routeConfig?.path?.split('/');
      if (this.webStorage?.getAllPageName().find((x: any) => x.pageURL.includes(urlSplit[0]))) {
        return true
      }
      else {
        this.router.navigate(['/access-denied']);
        return false
      }
  }
  
}
