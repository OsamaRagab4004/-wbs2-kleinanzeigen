import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { UnregisteredUserService } from '../services/unregistered-user.service';
import { UserService } from '../services/user.service';
import { MiniChatComponent } from './mini-chat/mini-chat.component';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.sass'],
})
export class ProductInfoComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private userService: UserService,
    private unregisteredUserService: UnregisteredUserService
  ) {}

  public produkt: any = {};
  public produktId: number = 0;
  private user: any;
  public bilder: any = [];
  public produktGemerkt = false;
  public verkaeuferGermerkt = false;

  openVerticallyCentered() {
    const modalRef = this.modalService.open(MiniChatComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.produktId = this.produktId;
    modalRef.componentInstance.verkaeuferName = `${this.produkt.verkaeufer.vorname} ${this.produkt.verkaeufer.nachname}`;
  }

  async ngOnInit() {
    this.user = await firstValueFrom(this.userService.getUserObservales());
    this.route.queryParams.subscribe((params) => {
      this.produktId = params['id'];
      this.httpClient
        .get(`http://localhost:3000/produkte/${params['id']}`)
        .subscribe((result: any) => {
          this.produkt = result;
          if (this.user) {
            this.verkaeuferGermerkt = (
              this.user.markierteVerkaeufer as any[]
            ).some(
              (markierterVerkauefer: any) =>
                +markierterVerkauefer.id === +this.produkt.verkaeufer.id
            );
            this.produktGemerkt = (this.user.markierteProdukte as any[]).some(
              (markiertesProdukt: any) =>
                +markiertesProdukt.id === +this.produktId
            );
          } else {
            this.verkaeuferGermerkt = this.unregisteredUserService
              .getSessionCookie()
              .gemerkteVerkaeufer.some(
                (markierterVerkauefer: any) =>
                  +markierterVerkauefer === +this.produkt.verkaeufer.id
              );
            this.produktGemerkt = this.unregisteredUserService
              .getSessionCookie()
              .gemerkteProdukte.some(
                (markierterVerkauefer: any) =>
                  +markierterVerkauefer === +this.produktId
              );
          }

          this.httpClient
            .get(`http://localhost:3000/produkte/${result.id}/bilder`)
            .subscribe((r) => {
              this.bilder = (r as string[]).map(
                (item) => `http://localhost:3000/uploads/${result.id}/${item}`
              );
            });
        });
    });
  }

  merkenAction() {
    if (this.produktGemerkt) {
      this.artikelEntfernen();
    } else {
      this.artikelMerken();
    }
  }

  verkaeuferMerkenAction() {
    if (this.verkaeuferGermerkt) {
      this.verkaeuferEntfernen();
    } else {
      this.verkaeuferMerken();
    }
  }

  verkaeuferMerken() {
    if (!this.user) {
      this.unregisteredUserService.verkaeuferMerken(this.produkt.verkaeufer.id);
      this.verkaeuferGermerkt = true;
      return;
    }
    this.httpClient
      .post(
        `http://localhost:3000/kaeufer/${this.user.id}/verkaeufer/${this.produkt.verkaeufer.id}/merken`,
        {},
        { withCredentials: true }
      )
      .subscribe((response) => {
        this.verkaeuferGermerkt = true;
      });
  }

  verkaeuferEntfernen() {
    if (!this.user) {
      this.unregisteredUserService.verkaeuferEntfernen(
        this.produkt.verkaeufer.id
      );
      this.verkaeuferGermerkt = false;
      return;
    }
    this.httpClient
      .post(
        `http://localhost:3000/kaeufer/${this.user.id}/verkaeufer/${this.produkt.verkaeufer.id}/entfernen`,
        {},
        { withCredentials: true }
      )
      .subscribe((response) => {
        this.verkaeuferGermerkt = false;
      });
  }

  artikelMerken() {
    if (!this.user) {
      this.unregisteredUserService.artikelMerken(+this.produktId);
      this.produktGemerkt = true;
      return;
    }
    this.httpClient
      .post(
        `http://localhost:3000/kaeufer/${this.user.id}/produkte/${this.produktId}/merken`,
        {},
        { withCredentials: true }
      )
      .subscribe((response) => {
        this.produktGemerkt = true;
      });
  }

  artikelEntfernen() {
    if (!this.user) {
      this.unregisteredUserService.artikelEntfernen(+this.produktId);
      this.produktGemerkt = false;
      return;
    }
    this.httpClient
      .post(
        `http://localhost:3000/kaeufer/${this.user.id}/produkte/${this.produktId}/entfernen`,
        {},
        { withCredentials: true }
      )
      .subscribe((response) => {
        this.produktGemerkt = false;
      });
  }
}
