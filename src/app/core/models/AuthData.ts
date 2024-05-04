import { User } from './user/User';

export interface AuthData extends User {
  password: string;
}
