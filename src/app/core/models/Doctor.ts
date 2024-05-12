import { DoctorDetails } from './DoctorDetails';

export interface Doctor {
  readonly id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber?: string;
  doctorDetails?: DoctorDetails;
  languages?: string[];
}
