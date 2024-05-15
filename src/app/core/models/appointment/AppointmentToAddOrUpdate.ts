import { AppointmentStatus } from '../../enums/AppointmentStatus';
import { Medicine } from './Medicine';

export interface AppointmentToAddOrUpdate {
  date: string;
  status: AppointmentStatus;
  description?: string;
  doctorId: string;
  patientId: string;
  examinationId: string;
  medicines?: Medicine[];
}
