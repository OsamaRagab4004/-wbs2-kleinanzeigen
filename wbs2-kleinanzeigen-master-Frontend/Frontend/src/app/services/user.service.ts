import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {
    this.retrieveUser();
  }

  user$ = new BehaviorSubject<User | null>(null);

  setUser(newUser: User | null) {
    this.user$.next(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  getUserObservales() {
    return this.user$.asObservable();
  }

  async getUser() {
    return firstValueFrom(
      this.httpClient.get<User>('http://localhost:3000/auth/profil', {
        withCredentials: true,
      })
    );
  }

  removeUser() {
    this.user$.next(null);
  }

  async retrieveUser() {
    try {
      const res = this.httpClient.get('http://localhost:3000/auth/profil', {
        withCredentials: true,
      });
      const promiseRes = await firstValueFrom(res).catch();
      this.setUser(promiseRes as User);
      return promiseRes;
    } catch (e) {
      this.setUser(null)
      return null;
    }
  }
}
