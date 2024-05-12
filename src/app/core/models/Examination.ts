import { ExaminationStatus } from '../enums/ExaminationStatus';

export interface Examination {
  readonly id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  status: ExaminationStatus;
}
