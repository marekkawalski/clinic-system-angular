import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { User } from '../models/user/User';

interface AuthData {
  email: string;
  password: string;
}

const AUTH_DATA_KEY = 'authData';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authDataSubject: BehaviorSubject<AuthData | null> =
    new BehaviorSubject<AuthData | null>(null);
  public authData: Observable<AuthData | null> =
    this.authDataSubject.asObservable();

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
  ) {
    const authData = sessionStorage.getItem(AUTH_DATA_KEY);
    if (authData) {
      this.authDataSubject = new BehaviorSubject<AuthData | null>(
        JSON.parse(authData),
      );
    }
  }

  login(email: string, password: string): Observable<User> {
    const token = `Basic ${window.btoa(email + ':' + password)}`;

    return this.http
      .post<any>(`${environment.apiUrl}/auth/login`, null, {
        headers: {
          Authorization: token,
        },
      })
      .pipe(
        map((userData: User) => {
          const authData = { email: email, password: password };
          sessionStorage.setItem(AUTH_DATA_KEY, JSON.stringify(authData));
          this.authDataSubject.next(authData);
          return userData;
        }),
      );
  }

  logout(): void {
    sessionStorage.clear();
    this.authDataSubject.next(null);
    this.router.navigate(['/login']).then(() => {
      console.log('You have been logged out.');
    });
  }
}
