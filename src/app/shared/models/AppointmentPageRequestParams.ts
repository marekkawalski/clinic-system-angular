import { PageRequestParams } from './PageRequestParams';
import { AppointmentStatus } from '@app/core/enums/AppointmentStatus';

export interface AppointmentPageRequestParams extends PageRequestParams {
  ['status']?: AppointmentStatus;
  ['start-date']?: string;
  ['end-date']?: string;
}
