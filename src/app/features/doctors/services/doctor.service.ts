import { Injectable } from '@angular/core';
import { UserPageRequestParams } from '../../../core/models/UserPageRequestParams';
import { Observable } from 'rxjs';
import { PageRequestResponseData } from '../../../shared/models/PageRequestResponseData';
import { HttpParamsHelper } from '../../../shared/helpers/httpParamsHelper';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Doctor } from '../../../core/models/Doctor';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  httpParamsHelper: HttpParamsHelper;

  constructor(private readonly http: HttpClient) {
    this.httpParamsHelper = new HttpParamsHelper();
  }

  getPagedDoctors(
    params?: UserPageRequestParams,
  ): Observable<PageRequestResponseData<Doctor>> {
    return this.http.get<PageRequestResponseData<Doctor>>(
      `${environment.apiUrl}/doctors/paged`,
      {
        params: this.httpParamsHelper.setupHttpParams(params),
      },
    );
  }
}
