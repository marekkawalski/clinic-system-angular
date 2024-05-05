import { HttpParams } from '@angular/common/http';
import { PageRequestParams } from '../models/PageRequestParams';

export class HttpParamsHelper {
  setupHttpParams(params?: PageRequestParams) {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key: string) => {
        const value = (params as any)[key];
        httpParams = httpParams.set(key, value);
      });
    }
    return httpParams;
  }
}
