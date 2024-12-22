import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-verkaeufer-card',
  templateUrl: './verkaeufer-card.component.html',
  styleUrls: ['./verkaeufer-card.component.sass'],
})
export class VerkaeuferCardComponent implements OnInit {
  @Input() verkaeufer?: User;
  @Output() removedFromWishlist = new EventEmitter<number>();
  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  merklisteEntfernen() {
    this.removedFromWishlist.emit(this.verkaeufer?.id);
  }

  goToProducts() {
    this.router.navigate(['/products'], { queryParams: { verkaeuferId: this.verkaeufer?.id }})
  }
}
