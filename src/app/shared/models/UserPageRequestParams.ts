import { PageRequestParams } from './PageRequestParams';
import { UserRole } from '../../core/enums/UserRole';

export interface UserPageRequestParams extends PageRequestParams {
  ['roles']?: UserRole[];
  ['show-disabled']?: boolean;
}
