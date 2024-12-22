import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class IsSessionInvalidGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private httpClient: HttpClient,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise<boolean | UrlTree>(async (resolve, _) => {
      try {
        const req = this.httpClient.get('http://localhost:3000/auth/profil', {
          withCredentials: true,
        });
        const promiseRes = await firstValueFrom(req);
        this.userService.setUser(promiseRes as User);
        resolve(this.router.createUrlTree(['/categories'])); //TODO: Go to dashboard
      } catch (e: any) {
        resolve(true);
      }
    });
  }
}
