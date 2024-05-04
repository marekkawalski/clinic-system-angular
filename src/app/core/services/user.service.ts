import { Injectable } from '@angular/core';
import { UserToAddOrUpdate } from '../models/user/UserToAddOrUpdate';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user/User';
import { environment } from '../../../environments/environment.development';
import { PageRequestResponseData } from '../../shared/models/PageRequestResponseData';
import { UserPageRequestParams } from '../models/UserPageRequestParams';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  updateUser(user: UserToAddOrUpdate, userId: string): Observable<User> {
    return this.http.put<any>(`${environment.apiUrl}/users/${userId}`, user);
  }

  getPagedUsers(
    params?: UserPageRequestParams,
  ): Observable<PageRequestResponseData<User>> {
    const httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key: string) => {
        const value = (params as any)[key];
        httpParams.set(key, value);
      });
    }
    return this.http.get<PageRequestResponseData<User>>(
      `${environment.apiUrl}/users/paged`,
      {
        params: httpParams,
      },
    );
  }
}
