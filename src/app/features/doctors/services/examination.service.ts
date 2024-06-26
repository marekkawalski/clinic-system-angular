import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParamsHelper } from '../../../shared/helpers/httpParamsHelper';
import { Observable } from 'rxjs';
import { Examination } from '../../../core/models/Examination';
import { PageRequestResponseData } from '../../../shared/models/PageRequestResponseData';
import { environment } from '../../../../environments/environment.development';
import { ExaminationPageRequestParams } from '../../../shared/models/ExaminationPageRequestParams';

@Injectable({
  providedIn: 'root',
})
export class ExaminationService {
  httpParamsHelper: HttpParamsHelper;

  constructor(private readonly http: HttpClient) {
    this.httpParamsHelper = new HttpParamsHelper();
  }

  getDoctorExaminations(doctorId: any): Observable<Examination[]> {
    return this.http.get<Examination[]>(
      `${environment.apiUrl}/doctors/${doctorId}/examinations`,
    );
  }

  getPagedDoctorExaminations(
    params: ExaminationPageRequestParams,
  ): Observable<PageRequestResponseData<Examination>> {
    return this.http.get<PageRequestResponseData<Examination>>(
      `${environment.apiUrl}/examinations/paged`,
      {
        params: this.httpParamsHelper.setupHttpParams(params),
      },
    );
  }
}
