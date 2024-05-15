import { PageRequestParams } from './PageRequestParams';
import { AppointmentStatus } from '../../core/enums/AppointmentStatus';

export interface AppointmentPageRequestParams extends PageRequestParams {
  ['status']?: AppointmentStatus;
  ['start-date']?: string;
  ['end-date']?: string;
}
