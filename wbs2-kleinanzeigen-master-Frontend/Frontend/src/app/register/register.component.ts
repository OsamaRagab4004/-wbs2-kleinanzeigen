import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Zustaende } from '../enums/zustaende';
import { ExceptionHandler } from '../shared/exception-handler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toasterService: ToastrService
  ) {}

  vorname = new FormControl('', [Validators.required]);
  nachname = new FormControl('');
  email = new FormControl('', [Validators.required, Validators.email]);
  passwort = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  passwortWiederholen = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    this.passwortWiederholenValidation(this.passwort),
  ]);
  telefonNummer = new FormControl('', [Validators.required]);
  istVerkaeufer = new FormControl(false, [Validators.required]);
  showPassword = false;
  showPasswordWiederholen = false;

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowPasswordWiederholen() {
    this.showPasswordWiederholen = !this.showPasswordWiederholen;
  }

  async register() {
    if(!this.validateInput()) {
      return
    }
    try {
      const res = this.httpClient.post(
        this.istVerkaeufer.value
          ? 'http://localhost:3000/auth/registrieren/verkaeufer'
          : 'http://localhost:3000/auth/registrieren/',
        {
          email: this.email.value,
          vorname: this.vorname.value,
          nachname: this.nachname.value,
          passwort: this.passwort.value,
          passwortWiederholen: this.passwortWiederholen.value,
          telefonNummer: this.telefonNummer.value,
          nutzerTyp: this.istVerkaeufer.value ? 'VERKAEUFER' : 'KAEUFER',
        },
        {
          withCredentials: true,
        }
      );
      await firstValueFrom(res);
      this.router.navigate(['/login'], {
        state: { zustand: Zustaende.REGISTRIERT },
      });
    } catch (e: any) {
        ExceptionHandler.handleError(e, this.toasterService)
    }
  }

  validateInput() {
    if (
      this.vorname.valid &&
      this.passwort.valid &&
      this.passwortWiederholen.valid &&
      this.email.valid &&
      ((this.istVerkaeufer.value && this.telefonNummer.valid) ||
        !this.istVerkaeufer.value)
    )
      return true;
    return false;
  }

  passwortWiederholenValidation(passwordForm: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const result = control.value !== passwordForm.value;
      return result ? { notSame: true } : null;
    };
  }
}
