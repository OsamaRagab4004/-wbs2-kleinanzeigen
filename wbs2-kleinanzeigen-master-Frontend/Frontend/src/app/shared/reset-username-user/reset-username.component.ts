import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ExceptionHandler } from '../exception-handler';
import { CustomValidators } from '../validators';

@Component({
  selector: 'app-reset-username',
  templateUrl: './reset-username.component.html',
  styleUrls: ['./reset-username.component.sass'],
})
export class ResetUsernameComponent {
  public form = new FormGroup({
    vorname: new FormControl("", [Validators.required]),
    nachname: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required]),
    telefonNummer: new FormControl("")
  })
  public user?: User | null;

  constructor(
    private httpClient: HttpClient,
    private activeModal: NgbActiveModal,
    private userService: UserService,
    private toasterService: ToastrService
  ) {
    this.userService.retrieveUser().then((response: any) => {
      this.user = response
      this.vorname.setValue(response.vorname ?? "")
      this.nachname.setValue(response.nachname ?? "")
      this.email.setValue(response.email ?? "")
      this.telefonNummer.addValidators(Validators.required)
      this.telefonNummer.setValue(response.telefonNummer ?? "")
    });
  }
  get vorname() {
    return this.form.controls.vorname
  }
  get nachname() {
    return this.form.controls.nachname
  }
  get email() {
    return this.form.controls.email
  }
  get telefonNummer() {
    return this.form.controls.telefonNummer
  }

  changeAccountInformation() {
    this.httpClient
      .patch(`http://localhost:3000/${(this.user?.nutzerTyp as string).toLowerCase()}/${this.user?.id}`, {
        vorname: this.vorname.value,
        nachname: this.nachname.value,
        email: this.email.value,
        telefonNummer: this.telefonNummer.value
      }, {
        withCredentials: true
      })
      .subscribe(
        (response) => {
          this.toasterService.success("Daten geändert")
          this.activeModal.close();
        },
        (e) => {
            ExceptionHandler.handleError(e, this.toasterService)
        }
      );
  }
}
