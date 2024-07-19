import { PageRequestParams } from './PageRequestParams';
import { UserRole } from '@app/core/enums/UserRole';

export interface UserPageRequestParams extends PageRequestParams {
  ['roles']?: UserRole[];
  ['show-disabled']?: boolean;
}
