import { PageRequestParams } from './PageRequestParams';

export interface ExaminationPageRequestParams extends PageRequestParams {
  ['doctor-ids']?: string[];
}
