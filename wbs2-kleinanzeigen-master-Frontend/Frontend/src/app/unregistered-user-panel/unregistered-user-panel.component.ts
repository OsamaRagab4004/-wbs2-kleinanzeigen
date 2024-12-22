import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { UnregisteredUserService } from '../services/unregistered-user.service';
import { ResetPassComponent } from '../shared/reset-pass-user/reset-pass.component';
import { ResetUsernameComponent } from '../shared/reset-username-user/reset-username.component';

@Component({
  selector: 'app-unregistered-user-panel',
  templateUrl: './unregistered-user-panel.component.html',
  styleUrls: ['./unregistered-user-panel.component.sass'],
})
export class UnregisteredUserPanelComponent implements OnInit {
  public user: any;
  public markierteProdukte: any = [];
  public markierteVerkaeufer: any = [];
  public chats: any = [];
  public selectedChat = 0;
  constructor(
    private httpService: HttpClient,
    private unregisteredUserService: UnregisteredUserService
  ) {}

  async ngOnInit() {
    const session = this.unregisteredUserService.getSessionCookie();
    this.markierteProdukte = [];
    this.markierteVerkaeufer = [];

    this.httpService
      .get(`http://localhost:3000/nachricht/user/${session.id}`, {
        withCredentials: true,
      })
      .subscribe((event) => {
        this.chats = (event as any)?.chats;
      });

    (session.gemerkteProdukte as number[])
      .filter((item) => !!item)
      .forEach((produkt) =>
        firstValueFrom(
          this.httpService.get(`http://localhost:3000/produkte/${produkt}`, {
            withCredentials: true,
          })
        ).then((item) => {
          (this.markierteProdukte as any[]).push(item);
        })
      );

    (session.gemerkteVerkaeufer as number[])
      .filter((item) => !!item)
      .forEach((verkaeufer) =>
        firstValueFrom(
          this.httpService.get(
            `http://localhost:3000/verkaeufer/${verkaeufer}`,
            {
              withCredentials: true,
            }
          )
        ).then((item) => {
          (this.markierteVerkaeufer as any[]).push(item);
        })
      );
  }

  changeChat(id: number) {
    this.selectedChat = id;
  }
  removeItem(id: number) {
    this.markierteProdukte = (this.markierteProdukte as any[]).filter(
      (item) => item.id !== id
    );
    this.unregisteredUserService.artikelEntfernen(id);
  }
  removeVerkaeufer(id: number) {
    this.markierteVerkaeufer = (this.markierteVerkaeufer as any[]).filter(
      (item) => item.id !== id
    );
    this.unregisteredUserService.verkaeuferEntfernen(id);
  }
}
