import { AppointmentStatus } from '../../enums/AppointmentStatus';
import { User } from '../user/User';
import { Examination } from '../Examination';
import { Medicine } from './Medicine';

export interface Appointment {
  readonly id: string;
  date: Date;
  status: AppointmentStatus;
  description: string;
  doctor: User;
  patient: User;
  examination: Examination;
  medicines?: Medicine[];
}
