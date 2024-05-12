import { Injectable } from '@angular/core';
import { UserPageRequestParams } from '../../../core/models/UserPageRequestParams';
import { map, Observable } from 'rxjs';
import { PageRequestResponseData } from '../../../shared/models/PageRequestResponseData';
import { HttpParamsHelper } from '../../../shared/helpers/httpParamsHelper';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Doctor } from '../../../core/models/Doctor';
import { DailySchedule } from '../../../core/models/user/Schedule';

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

  getDoctorByEmail(email: string): Observable<Doctor> {
    return this.http
      .get<Doctor>(`${environment.apiUrl}/doctors/email/${email}`)
      .pipe(
        map(d => {
          if (d.doctorDetails?.schedule?.dailySchedules) {
            const entries: [string, DailySchedule][] = Object.entries(
              d.doctorDetails.schedule.dailySchedules,
            );
            d.doctorDetails.schedule.dailySchedules = new Map<
              string,
              DailySchedule
            >(entries);
          }
          return d;
        }),
      );
  }
}
