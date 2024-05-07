import { DoctorDetails } from './DoctorDetails';

export interface Doctor {
  name: string;
  surname: string;
  email: string;
  phoneNumber?: string;
  doctorDetails?: DoctorDetails;
}
