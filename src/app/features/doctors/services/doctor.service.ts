import { Injectable } from '@angular/core';
import { UserPageRequestParams } from '@app/shared/models/UserPageRequestParams';
import { map, Observable } from 'rxjs';
import { PageRequestResponseData } from '@app/shared/models/PageRequestResponseData';
import { HttpParamsHelper } from '@app/shared/helpers/httpParamsHelper';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import { Doctor } from '@app/core/models/Doctor';
import { DailySchedule } from '@app/core/models/user/Schedule';
import { AvailableAppointments } from '../model/AvailableAppointments';

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
            >(
              entries.map(([key, value]) => {
                const startDate = new Date();
                const endDate = new Date();
                const [sh, sm] = value.startTime.split(':');
                const [eh, em] = value.endTime.split(':');

                startDate.setUTCHours(+sh, +sm, 0, 0);
                endDate.setUTCHours(+eh, +em, 0, 0);

                value.startTime = startDate.toLocaleTimeString();
                value.endTime = endDate.toLocaleTimeString();

                return [key, value];
              }),
            );
          }

          return d;
        }),
      );
  }

  getAvailableAppointments(
    doctorId: string,
    examinationId: string,
    date: string,
  ): Observable<AvailableAppointments[]> {
    return this.http
      .get<
        AvailableAppointments[]
      >(`${environment.apiUrl}/doctors/${doctorId}/examinations/${examinationId}/available-appointments/date/${date}`)
      .pipe(
        map(a =>
          a.map(aa => {
            aa.date = new Date(aa.date);
            return aa;
          }),
        ),
      );
  }
}
