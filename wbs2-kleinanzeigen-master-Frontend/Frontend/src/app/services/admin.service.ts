import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { User } from '../models/user';
import { VerkaeuferAnfragen } from '../models/verkaeufer-anfragen';
import { ExceptionHandler } from '../shared/exception-handler';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private httpClient: HttpClient,
    private toasterService: ToastrService
  ) {
    this.retrieveAll();
  }
  anfragen$ = new BehaviorSubject<Array<VerkaeuferAnfragen>>([]);
  kaeufer$ = new BehaviorSubject<Array<User>>([]);
  verkaeufer$ = new BehaviorSubject<Array<User>>([]);

  removeById<T extends Array<User | VerkaeuferAnfragen>>(
    id: number,
    subject: BehaviorSubject<T>
  ) {
    subject.next(subject.value.filter((it) => it.id !== id) as T);
  }
  retrieveAll() {
    this.retrieveAnfragen();
    this.retrieveKaeufer();
    this.retrieveVerkaeufer();
  }
  retrieve(key: 'VERKAEUFER' | 'KAEUFER') {
    switch (key) {
      case 'VERKAEUFER':
        return this.retrieveVerkaeufer();
      case 'KAEUFER':
        return this.retrieveKaeufer();
    }
  }

  async retrieveAnfragen() {
    return this.retrieveData(
      'http://localhost:3000/admin/verkaeufer/anfragen',
      this.anfragen$
    );
  }
  async retrieveVerkaeufer() {
    return this.retrieveData(
      'http://localhost:3000/verkaeufer',
      this.verkaeufer$
    );
  }
  async retrieveKaeufer() {
    return this.retrieveData('http://localhost:3000/kaeufer', this.kaeufer$);
  }

  private async retrieveData<T>(url: string, subject: BehaviorSubject<T>) {
    try {
      const res = this.httpClient.get<T>(url, { withCredentials: true });
      const promiseRes = await firstValueFrom(res);
      subject.next(promiseRes);
    } catch (e) {
        ExceptionHandler.handleError(e, this.toasterService)
    }
  }
}
