import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.sass'],
})
export class ResetPassComponent {
  public oldPassword: string = '';
  public newPassword: string = '';
  public newPasswordRepeat: string = '';
  public user: any;
  public error?: number;
  public showOldPassword = false
  public showNewPassword = false
  public showNewRepeatPassword = false

  constructor(
    private httpService: HttpClient,
    private userService: UserService,
    private activeModalService: NgbActiveModal,
    private toasterService: ToastrService
  ) {
    this.userService.retrieveUser().then((response: any) => (this.user = response));
  }


    toggleShowOldPassword() {
        this.showOldPassword = !this.showOldPassword
    }
    toggleShowNewPassword() {
        this.showNewPassword = !this.showNewPassword
    }
    toggleShowNewRepeatPassword() {
        this.showNewRepeatPassword = !this.showNewRepeatPassword
    }
  savePassword() {
    this.httpService
      .patch(`http://localhost:3000/auth/${this.user.id}/passwort-aendern`, {
        altesPasswort: this.oldPassword,
        neuesPasswort: this.newPassword,
        neuesPasswortWiederholen: this.newPasswordRepeat,
      })
      .subscribe(
        (response) => {
          this.toasterService.success("Passwort geändert")
          this.activeModalService.close();
        },
        (error) => {
          this.error = error.error.statusCode;
        }
      );
  }
}
