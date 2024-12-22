import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Zustaende } from 'src/app/enums/zustaende';
import { UserService } from 'src/app/services/user.service';
import { ExceptionHandler } from '../exception-handler';
import { ResetPassComponent } from '../reset-pass-user/reset-pass.component';
import { ResetUsernameComponent } from '../reset-username-user/reset-username.component';

@Component({
  selector: 'app-edit-user-data',
  templateUrl: './edit-user-data.component.html',
  styleUrls: ['./edit-user-data.component.sass'],
})
export class EditUserDataComponent {
  constructor(
    private modalService: NgbModal,
    private httpClient: HttpClient,
    private userService: UserService,
    private router: Router,
    private toasterService: ToastrService
  ) {}
  openPersoenlicheDatenAendern() {
    this.modalService.open(ResetUsernameComponent, { centered: true });
  }
  openPasswortAendern() {
    this.modalService.open(ResetPassComponent, { centered: true });
  }

  async handleDeleteConfirm() {
    try {
      const res = this.httpClient.delete('http://localhost:3000/auth', {
        withCredentials: true,
      });
      const promiseRes = await firstValueFrom(res);
      await this.userService.retrieveUser();
      this.router.navigate(['/'], {
        state: { zustand: Zustaende.KONTO_GELOESCHT },
      });
    } catch (e) {
        ExceptionHandler.handleError(e, this.toasterService)
    }
  }
}
