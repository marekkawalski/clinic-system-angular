import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import { Observable } from 'rxjs';
import { User } from '../models/user/User';
import { UserToAddOrUpdate } from '../models/user/UserToAddOrUpdate';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private readonly http: HttpClient) {}

  register(user: UserToAddOrUpdate): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/registration`, user);
  }
}
