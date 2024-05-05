import { UserRole } from '../../enums/UserRole';
import { Address } from '../Address';
import { DoctorDetails } from '../DoctorDetails';

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  pesel: string;
  address: Address;
  doctorDetails: DoctorDetails;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}
