import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { VerkaeuferAnfragen as VerkaeuferAnfrage } from '../models/verkaeufer-anfragen';
import { AdminService } from '../services/admin.service';
import { ExceptionHandler } from '../shared/exception-handler';
import { EditUserComponent } from './edit-user/edit-user.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass'],
})
export class AdminComponent implements DoCheck {
  anfragen$: Observable<Array<VerkaeuferAnfrage>>;

  constructor(
    private route: Router,
    private modalService: NgbModal,
    private adminService: AdminService
  ) {
    this.anfragen$ = adminService.anfragen$;
    this.adminService.retrieveAll();
  }
  ngDoCheck(): void {
    if (this.route.url == '/admin/sellers-list') {
      let upper = document.querySelector('.upper');
      upper?.classList.add('uppertheme');
    } else {
      let upper = document.querySelector('.upper');
      upper?.classList.remove('uppertheme');
    }
  }

  async processAnfrage(anfrage: VerkaeuferAnfrage) {
    const modalRef = this.modalService.open(EditUserComponent, {
      centered: true,
    });
    modalRef.componentInstance.id = anfrage.id;
    modalRef.componentInstance.vorname.setValue(anfrage.vorname);
    modalRef.componentInstance.nachname.setValue(anfrage.nachname);
    modalRef.componentInstance.email.setValue(anfrage.email);
    modalRef.componentInstance.telefonNummer.setValue(anfrage.telefonNummer);
    modalRef.componentInstance.akzept.setValue(anfrage.genehmigt);
    modalRef.result
      .then(() => {
        this.adminService.retrieveAll();
      })
      .catch(ExceptionHandler.modalDismissed);
  }
}
