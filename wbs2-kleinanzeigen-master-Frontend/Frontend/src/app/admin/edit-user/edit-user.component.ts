import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { ExceptionHandler } from 'src/app/shared/exception-handler';
import { CustomValidators } from 'src/app/shared/validators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.sass'],
})
export class EditUserComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.nutzertyp === 'VERKAEUFER') {
      this.form.controls.telefonNummer.addValidators([Validators.required]);
      this.form.controls.akzept.addValidators([Validators.required]);
      this.form.controls.standNummer.addValidators([
        Validators.required,
        Validators.min(1),
      ]);
      this.form.controls.standNummer.addAsyncValidators([
        this.standNummerIsUsedValidation({isUsed : true}),
      ]);
      this.form.controls.email.updateValueAndValidity();
    }
  }
  nutzertyp: 'VERKAEUFER' | 'KAEUFER' = 'VERKAEUFER';
  id: number = -1;
  form = new FormGroup({
    vorname: new FormControl('', [Validators.required]),
    nachname: new FormControl(''),
    telefonNummer: new FormControl(''),
    email: new FormControl(
      '',
      [Validators.required],
      [this.emailIsUsedValidation({ isUsed: true })]
    ),
    standNummer: new FormControl(0),
    akzept: new FormControl(false),
  });

  getVerkaeuferByStandNummer(): Observable<Array<User>> {
    return this.httpClient.get<Array<User>>(
      `http://localhost:3000/verkaeufer?standNummer=${this.standNummer.value}`
    );
  }

  getUserByEmail(): Observable<Array<User>> {
    return this.httpClient.get<Array<User>>(
      `http://localhost:3000/admin/users?email=${this.email.value}`,
      { withCredentials: true }
    );
  }

  get vorname() {
    return this.form.controls.vorname;
  }
  get nachname() {
    return this.form.controls.nachname;
  }
  get telefonNummer() {
    return this.form.controls.telefonNummer;
  }
  get email() {
    return this.form.controls.email;
  }
  get standNummer() {
    return this.form.controls.standNummer;
  }
  get akzept() {
    return this.form.controls.akzept;
  }

  standNummerIsUsedValidation(error: ValidationErrors): AsyncValidatorFn {
    return CustomValidators.isUsedValidation(
      this,
      error,
      this.errorMappingFunction,
      this.getVerkaeuferByStandNummer
    );
  }

  emailIsUsedValidation(error: ValidationErrors): AsyncValidatorFn {
    return CustomValidators.isUsedValidation(
      this,
      error,
      this.errorMappingFunction,
      this.getUserByEmail
    );
  }

  errorMappingFunction(res: Array<User>, error: ValidationErrors) {
    return res && res.length !== 0 && res[0].id !== this.id ? error : null;
  }
  closeModal() {
    this.activeModal.close();
  }

  async sendRequest() {
    if (!this.form.valid || this.form.pristine) {
      this.activeModal.close();
    }
    const patchUrl = `http://localhost:3000/${
      this.nutzertyp === 'VERKAEUFER' ? 'admin/verkaeufer' : 'kaeufer'
    }/${this.id}`;
    try {
      const res = this.httpClient.patch(
        patchUrl,
        {
          vorname: this.vorname.value,
          nachname: this.nachname.value,
          telefonNummer: this.telefonNummer.value,
          email: this.email.value,
          genehmigt: this.akzept.value,
          standNummer: this.standNummer.value,
        },
        { withCredentials: true }
      );
      await firstValueFrom(res);
    } catch (e) {
        ExceptionHandler.handleError(e, this.toasterService)
    } finally {
      this.closeModal()
    }
  }
}
