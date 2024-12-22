import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NutzerTyp } from '../enums/nutzer-typ';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.sass'],
})
export class ProductCardComponent implements OnInit {
  @Input() produkt: any;
  @Input() allowRemoval: boolean =  false;
  @Output() removeProduct = new EventEmitter<number>();
  public currentNutzertyp: NutzerTyp = NutzerTyp.KAEUFER;
  public bilder: string[] = [];

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private userService: UserService
  ) {
    firstValueFrom(this.userService.getUserObservales()).then((user) => {
      {
        this.currentNutzertyp =
          (user?.nutzerTyp as NutzerTyp) ?? this.currentNutzertyp;
      }
    });
  }

  ngOnInit() {
    this.httpClient
      .get(`http://localhost:3000/produkte/${this.produkt.id}/bilder`)
      .subscribe((r) => {
        this.bilder = (r as any[]).map(
          (r) => `http://localhost:3000/uploads/${this.produkt.id}/${r}`
        );
      });
  }

  navigateToProdukt(id: number) {
    switch (this.currentNutzertyp) {
      case NutzerTyp.VERKAEUFER:
        return this.router.navigate(['edit-product', id]);
      case NutzerTyp.KAEUFER:
        return this.router.navigate(['product-info'], { queryParams: { id } });
      default:
        return;
    }
  }

  handleRemoveProduct() {
    this.removeProduct.emit(+this.produkt.id);
  }
}
