import { Injectable } from '@angular/core';
import { HttpParamsHelper } from '../helpers/httpParamsHelper';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import { AppointmentToAddOrUpdate } from '@app/core/models/appointment/AppointmentToAddOrUpdate';
import { map, Observable } from 'rxjs';
import { Appointment } from '@app/core/models/appointment/Appointment';
import { PageRequestResponseData } from '../models/PageRequestResponseData';
import { AppointmentPageRequestParams } from '../models/AppointmentPageRequestParams';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  httpParamsHelper: HttpParamsHelper;

  constructor(private readonly http: HttpClient) {
    this.httpParamsHelper = new HttpParamsHelper();
  }

  createAppointment(
    appointment: AppointmentToAddOrUpdate,
  ): Observable<Appointment> {
    return this.http.post<Appointment>(
      `${environment.apiUrl}/appointments`,
      appointment,
    );
  }

  updateAppointment(
    appointment: AppointmentToAddOrUpdate,
    appointmentId: string,
  ): Observable<Appointment> {
    return this.http.put<Appointment>(
      `${environment.apiUrl}/appointments/${appointmentId}`,
      appointment,
    );
  }

  getPagedDoctorAppointments(
    appointmentPageRequestParams: AppointmentPageRequestParams,
    doctorId: string,
  ): Observable<PageRequestResponseData<Appointment>> {
    return this.http
      .get<PageRequestResponseData<Appointment>>(
        `${environment.apiUrl}/appointments/doctors/${doctorId}`,
        {
          params: this.httpParamsHelper.setupHttpParams(
            appointmentPageRequestParams,
          ),
        },
      )
      .pipe(
        map(response => {
          response?.content.forEach(appointment => {
            appointment.date = new Date(appointment.date);
          });
          return response;
        }),
      );
  }

  getPagedPatientAppointments(
    params: AppointmentPageRequestParams,
    userId: string,
  ) {
    return this.http
      .get<PageRequestResponseData<Appointment>>(
        `${environment.apiUrl}/appointments/patients/${userId}`,
        {
          params: this.httpParamsHelper.setupHttpParams(params),
        },
      )
      .pipe(
        map(response => {
          response?.content?.forEach(appointment => {
            appointment.date = new Date(appointment.date);
          });
          return response;
        }),
      );
  }
}
