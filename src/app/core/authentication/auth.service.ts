import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@environments/environment.development';
import { User } from '../models/user/User';
import { AuthData } from '../models/AuthData';
import { PathConstants } from '../constants/path.constants';
import { UserRole } from '../enums/UserRole';

const AUTH_DATA_KEY = 'authData';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  redirectUrl: string | null = null;
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
      const authDataObj: AuthData = JSON.parse(authData);
      if (authDataObj) {
        this.authDataSubject.next(JSON.parse(authData));
      }
    }
  }

  get authDataValue(): AuthData | null {
    return this.authDataSubject.value;
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
          const authData = { ...userData, password };
          sessionStorage.setItem(AUTH_DATA_KEY, JSON.stringify(authData));
          this.authDataSubject.next(authData);
          return userData;
        }),
      );
  }

  logout(): void {
    sessionStorage.clear();
    this.authDataSubject.next(null);
    this.router.navigate([PathConstants.LOGIN_PATH]).then(() => {
      console.log('You have been logged out.');
    });
  }

  checkAccess(allowedRoles: UserRole[]): boolean {
    const authData = this.authDataValue;
    if (authData) {
      return allowedRoles.includes(authData.role);
    }
    return false;
  }
}
