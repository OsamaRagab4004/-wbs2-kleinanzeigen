import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Zustaende } from '../enums/zustaende';
import { Produkt } from '../models/produkt';
import { UserService } from '../services/user.service';
import { ExceptionHandler } from '../shared/exception-handler';

@Component({
  selector: 'app-verkaeufer-panel',
  templateUrl: './verkaeufer-panel.component.html',
  styleUrls: ['./verkaeufer-panel.component.sass'],
})
export class VerkaeuferPanelComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private httpService: HttpClient,
    private userService: UserService,
    private router: Router,
    private toasterService: ToastrService
  ) {}

  private user: any;
  public chats: any[] = [];
  public selectedChat: number = 0;
  public produkte: Produkt[] = [];

  ngOnInit(): void {
    firstValueFrom(this.userService.getUserObservales()).then((user) => {
      this.user = user;
      this.httpService
        .get(`http://localhost:3000/nachricht/verkaeufer/${this.user.id}`)
        .subscribe((event) => {
          this.chats = (event as any).chats;
        });
      this.httpService
        .get(`http://localhost:3000/produkte/verkaeufer/${this.user.id}`)
        .subscribe((event: any) => {
          this.produkte = event;
        });
    });
  }

  changeChat(id: number) {
    this.selectedChat = id;
  }
  async handleRemoveProduct(id: number) {
    try {
        const res = this.httpService.delete(`http://localhost:3000/produkte/${id}`, {withCredentials: true });
        this.produkte = this.produkte.filter((it) => it.id !== id)
        const promiseRes = await firstValueFrom(res);
        this.router.navigate([], { state: { zustand: Zustaende.PRODUKT_GELOESCHT}})
    } catch(e) {
        ExceptionHandler.handleError(e, this.toasterService)
    }

  }
}
