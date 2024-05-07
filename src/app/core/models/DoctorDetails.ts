import { Schedule } from './user/Schedule';

export interface DoctorDetails {
  specialization?: string;
  education?: string;
  description?: string;
  schedule?: Schedule;
}
