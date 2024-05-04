import { PageRequestParams } from '../../shared/models/PageRequestParams';
import { UserRole } from '../enums/UserRole';

export interface UserPageRequestParams extends PageRequestParams {
  ['roles']: UserRole[];
}
