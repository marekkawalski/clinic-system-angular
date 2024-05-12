import { Injectable } from '@angular/core';
import { UserToAddOrUpdate } from '../models/user/UserToAddOrUpdate';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../models/user/User';
import { environment } from '../../../environments/environment.development';
import { PageRequestResponseData } from '../../shared/models/PageRequestResponseData';
import { UserPageRequestParams } from '../models/UserPageRequestParams';
import { DateHelper } from '../../shared/helpers/dateHelper';
import { HttpParamsHelper } from '../../shared/helpers/httpParamsHelper';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  dateHelper: DateHelper<User>;
  httpParamsHelper: HttpParamsHelper;

  constructor(private readonly http: HttpClient) {
    this.dateHelper = new DateHelper();
    this.httpParamsHelper = new HttpParamsHelper();
  }

  updateUser(user: UserToAddOrUpdate, userId: string): Observable<User> {
    return this.http.put<any>(`${environment.apiUrl}/users/${userId}`, user);
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${userId}`);
  }

  getPagedUsers(
    params?: UserPageRequestParams,
  ): Observable<PageRequestResponseData<User>> {
    return this.http
      .get<PageRequestResponseData<User>>(`${environment.apiUrl}/users/paged`, {
        params: this.httpParamsHelper.setupHttpParams(params),
      })
      .pipe(
        map((data: PageRequestResponseData<User>) =>
          this.dateHelper.convertDateStringsToDates(data, [
            'createdAt',
            'updatedAt',
            'lastLogin',
          ]),
        ),
      );
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/email/${email}`);
  }
}
