import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { UserService } from './../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class NutzertypGuard implements CanActivate {
  constructor(private userService: UserService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return new Promise(async (resolve, _) => {
      const nutzertyp = route.data['sessionNutzertyp'] as string;
      if (this.userService.user$.value === null) {
        const user = (await this.userService.retrieveUser()) as User;
        if (user?.nutzerTyp === nutzertyp) resolve(true);
      } else if (this.userService.user$.value?.nutzerTyp === nutzertyp) {
        resolve(true);
      }
      resolve(false);
    });
  }
}
