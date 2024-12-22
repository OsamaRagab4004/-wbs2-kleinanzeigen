import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Zustaende } from '../enums/zustaende';
import { User } from '../models/user';
import { UnregisteredUserService } from '../services/unregistered-user.service';
import { UserService } from '../services/user.service';
import { ExceptionHandler } from '../shared/exception-handler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent {
  public hasUnregisteredSession: boolean = false;
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private userService: UserService,
    private toasterService: ToastrService,
    private unregisteredUserService: UnregisteredUserService
  ) {
    this.hasUnregisteredSession = !![
      ...unregisteredUserService.getSessionCookie().gemerkteProdukte,
      ...unregisteredUserService.getSessionCookie().gemerkteVerkaeufer,
    ].length;
  }
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  showPassword = false;

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    if (!(this.email.valid && this.password.valid)) return;
    const res = this.httpClient.post(
      'http://localhost:3000/auth/anmelden',
      {
        email: this.email.value,
        passwort: this.password.value,
      },
      {
        withCredentials: true,
      }
    );
    try {
      const promiseRes = await firstValueFrom(res);
      this.unregisteredUserService.deleteSessionCookie();
      this.userService.setUser(promiseRes as User);
      this.router.navigate(['/'], { state: { zustand: Zustaende.ANGEMELDET } });
    } catch (e: any) {
        ExceptionHandler.handleError(e, this.toasterService)
    }
  }
}
