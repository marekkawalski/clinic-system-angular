import { PageRequestParams } from '../../shared/models/PageRequestParams';

export interface ExaminationPageRequestParams extends PageRequestParams {
  ['doctor-ids']?: string[];
}
