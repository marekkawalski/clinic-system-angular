import { UserRole } from '../../enums/UserRole';
import { Address } from '../Address';
import { DoctorDetails } from '../DoctorDetails';

export interface UserToAddOrUpdate {
  name: string;
  surname: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  pesel: string;
  address: Address;
  doctorDetails?: DoctorDetails;
  password?: string;
  isEnabled?: boolean;
}
