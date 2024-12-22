import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { ResetPassComponent } from '../shared/reset-pass-user/reset-pass.component';
import { ResetUsernameComponent } from '../shared/reset-username-user/reset-username.component';

@Component({
  selector: 'app-kaeufer',
  templateUrl: './kaeufer.component.html',
  styleUrls: ['./kaeufer.component.sass'],
})
export class KaeuferComponent implements OnInit {
  public user: any;
  public markierteProdukte: any = [];
  public markierteVerkaeufer: any = [];
  public chats: any = [];
  public selectedChat = 0;
  constructor(
    private httpService: HttpClient,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.userService.getUserObservales().subscribe((user) => {
        if(!user) return
        this.user = user;
        this.markierteProdukte = user.markierteProdukte;
        this.markierteVerkaeufer = user.markierteVerkaeufer;
        this.httpService
          .get(`http://localhost:3000/nachricht/kaeufer/${user.id}`, {
            withCredentials: true,
          })
          .subscribe((event) => {
            this.chats = (event as any).chats;
          });
    })
  }


  changeChat(id: number) {
    this.selectedChat = id;
  }
  removeItem(id: number) {
    this.httpService
      .post(
        `http://localhost:3000/kaeufer/${this.user.id}/produkte/${id}/entfernen`,
        {},
        { withCredentials: true }
      )
      .subscribe(() => {
        this.markierteProdukte = (this.markierteProdukte as any[]).filter(
          (item) => item.id !== id
        );
      });
  }
  removeVerkaeufer(id: number) {
    this.httpService
      .post(
        `http://localhost:3000/kaeufer/${this.user.id}/verkaeufer/${id}/entfernen`,
        {},
        { withCredentials: true }
      )
      .subscribe(() => {
        this.markierteVerkaeufer = (this.markierteVerkaeufer as any[]).filter(
          (item) => item.id !== id
        );
      });
  }
}
