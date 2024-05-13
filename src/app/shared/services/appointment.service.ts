import { Injectable } from '@angular/core';
import { HttpParamsHelper } from '../helpers/httpParamsHelper';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AppointmentToAddOrUpdate } from '../../core/models/appointment/AppointmentToAddOrUpdate';
import { Observable } from 'rxjs';
import { Appointment } from '../../core/models/appointment/Appointment';

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
}
