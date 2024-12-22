import { Injectable } from '@angular/core';
import { addMonths } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';

interface SessionCookie {
  id: string;
  gemerkteProdukte: number[];
  gemerkteVerkaeufer: number[];
}

@Injectable({
  providedIn: 'root',
})
export class UnregisteredUserService {
  constructor(private cookieService: CookieService) {
    this.getSessionCookie();
  }

  public initSessionCookie() {
    this.setSessionCookie({
      id: crypto.randomUUID(),
      gemerkteProdukte: [],
      gemerkteVerkaeufer: [],
    });
  }

  public getSessionCookie(): SessionCookie {
    if (!this.cookieService.get('unregisteredSession')) {
      this.initSessionCookie();
    }
    return JSON.parse(
      this.cookieService.get('unregisteredSession')
    ) as SessionCookie;
  }

  public setSessionCookie(cookie: SessionCookie) {
    this.cookieService.set(
      'unregisteredSession',
      JSON.stringify(cookie),
      addMonths(new Date(), 1),
      "/"
    );
  }

  public deleteSessionCookie() {
    this.cookieService.delete('unregisteredSession');
  }

  public artikelMerken(artikel: number) {
    const cookie = this.getSessionCookie();

    cookie.gemerkteProdukte = [...cookie.gemerkteProdukte, artikel];
    this.setSessionCookie(cookie);
  }

  public artikelEntfernen(artikel: number) {
    const cookie = this.getSessionCookie();

    cookie.gemerkteProdukte = cookie.gemerkteProdukte.filter(
      (item) => item !== artikel
    );
    this.setSessionCookie(cookie);
  }

  public verkaeuferMerken(verkaeufer: number) {
    const cookie = this.getSessionCookie();

    cookie.gemerkteVerkaeufer = [...cookie.gemerkteVerkaeufer, verkaeufer];
    this.setSessionCookie(cookie);
  }

  public verkaeuferEntfernen(verkaeufer: number) {
    const cookie = this.getSessionCookie();

    cookie.gemerkteVerkaeufer = cookie.gemerkteVerkaeufer.filter(
      (item) => item !== verkaeufer
    );
    this.setSessionCookie(cookie);
  }
}
