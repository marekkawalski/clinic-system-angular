import { AppointmentStatus } from '../../enums/AppointmentStatus';

export interface AppointmentToAddOrUpdate {
  date: string;
  status: AppointmentStatus;
  description?: string;
  doctorId: string;
  patientId: string;
  examinationId: string;
}
