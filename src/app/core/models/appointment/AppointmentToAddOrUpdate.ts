import { AppointmentStatus } from '../../enums/AppointmentStatus';
import { Medicine } from './Medicine';

export interface AppointmentToAddOrUpdate {
  date: Date;
  status: AppointmentStatus;
  description?: string;
  doctorId: string;
  patientId: string;
  examinationId: string;
  medicines?: Medicine[];
}
