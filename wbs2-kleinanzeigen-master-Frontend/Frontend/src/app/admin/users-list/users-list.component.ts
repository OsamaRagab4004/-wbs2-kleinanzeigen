import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { first, firstValueFrom, map, Observable, of, take, tap } from 'rxjs';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import { ExceptionHandler } from 'src/app/shared/exception-handler';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.sass'],
})
export class UsersListComponent {
  constructor(
    private modalService: NgbModal,
    private adminService: AdminService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private toasterService: ToastrService
  ) {
    route.data
    .pipe(
        first())
    .subscribe((data) => {
        this.editNutzertyp = data['editNutzertyp'] ?? "VERKAEUFER"
        this.user$ = this.editNutzertyp === "VERKAEUFER" ? this.adminService.verkaeufer$ : this.adminService.kaeufer$;
    })
  }
  editNutzertyp: "VERKAEUFER" | "KAEUFER" = "VERKAEUFER"
  user$: Observable<Array<User>> = of([]);
  currentUser: User | null = null
  passwordResets: Map<number, string> = new Map()

  
  async processUser(user: User) {
    const modalRef = this.modalService.open(EditUserComponent, {
      centered: true,
    });
    
    modalRef.componentInstance.nutzertyp = this.editNutzertyp;
    modalRef.componentInstance.id = user.id;
    modalRef.componentInstance.form.controls.vorname.setValue(
      user.vorname
    );
    modalRef.componentInstance.form.controls.nachname.setValue(
      user.nachname
    );
    modalRef.componentInstance.form.controls.email.setValue(user.email);
    modalRef.componentInstance.form.controls.telefonNummer.setValue(
      user.telefonNummer
    );
    modalRef.componentInstance.form.controls.standNummer.setValue(user.standNummer);
    modalRef.componentInstance.form.controls.akzept.setValue(true);
    modalRef.result
    .then(() => this.adminService.retrieveAll())
    .catch(ExceptionHandler.modalDismissed);
  }

  handleUser(user: User) {
    this.currentUser = user
  }


  handleCancel() {
    this.currentUser = null
  }

  async handleDeleteConfirm() {
    if(!this.currentUser) return
    const deleteUrl = `http://localhost:3000/${this.editNutzertyp.toLowerCase()}/${this.currentUser.id}`
    try {
        const res = this.httpClient.delete(deleteUrl.toString(), {withCredentials: true})
        await firstValueFrom(res)
        this.adminService.retrieve(this.editNutzertyp)
    } catch(e) {
        ExceptionHandler.handleError(e, this.toasterService)
    }
  }

  async handleResetPasswordConfirm() {
    if(!this.currentUser) return
    const resetUrl = `http://localhost:3000/admin/${this.currentUser.id.toString()}/passwort-zuruecksetzen`
    try {
        const res = this.httpClient.post<{ neuesPasswort: string }>(resetUrl, null,  { withCredentials: true })
        const promiseRes = await firstValueFrom(res)
        const newPassword = promiseRes.neuesPasswort
        this.passwordResets.set(this.currentUser.id, newPassword)
    } catch (e) {
        ExceptionHandler.handleError(e, this.toasterService)
    }
  }

  copyPasswordToClipboard(id: number) {
    const password = this.passwordResets.get(id)
    if(password) {
        navigator.clipboard.writeText(password)
    }
  }

}
