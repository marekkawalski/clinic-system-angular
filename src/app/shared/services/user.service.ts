import { Injectable } from '@angular/core';
import { UserToAddOrUpdate } from '../../core/models/user/UserToAddOrUpdate';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user/User';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  updateUser(user: UserToAddOrUpdate, userId: string): Observable<User> {
    return this.http.put<any>(`${environment.apiUrl}/users/${userId}`, user);
  }
}
