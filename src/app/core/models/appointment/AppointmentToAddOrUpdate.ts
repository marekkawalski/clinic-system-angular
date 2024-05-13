import { AppointmentStatus } from '../../enums/AppointmentStatus';

export interface AppointmentToAddOrUpdate {
  date: Date;
  status: AppointmentStatus;
  description: string;
  doctorId: string;
  patientId: string;
  examinationId: string;
}
