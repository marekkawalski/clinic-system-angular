import { Component, Input, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '@app/core/authentication/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { format } from 'date-fns';
import { Examination } from '@app/core/models/Examination';
import { ExaminationService } from '../../services/examination.service';
import { AvailableAppointments } from '../../model/AvailableAppointments';
import { AppointmentService } from '@app/shared/services/appointment.service';
import { AppointmentStatus } from '@app/core/enums/AppointmentStatus';
import { AppointmentToAddOrUpdate } from '@app/core/models/appointment/AppointmentToAddOrUpdate';
import { Appointment } from '@app/core/models/appointment/Appointment';
import { Doctor } from '@app/core/models/Doctor';

@Component({
  selector: 'app-schedule-appointment',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatNativeDateModule,
    DatePipe,
    NgForOf,
    NgIf,
  ],
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.scss'],
})
export class ScheduleAppointmentComponent implements OnInit {
  @Input() doctor?: Doctor;
  submitted = false;
  availableAppointmentDates: AvailableAppointments[] = [];
  selectedDate?: Date;
  selectedExaminationId?: string;
  doctorExaminations: Examination[] = [];

  constructor(
    protected readonly doctorService: DoctorService,
    protected readonly authService: AuthService,
    private readonly router: Router,
    private readonly toast: SnackbarService,
    private readonly examinationService: ExaminationService,
    private readonly appointmentService: AppointmentService,
  ) {}

  onSubmit() {
    this.submitted = true;

    if (!this.selectedDate || !this.selectedExaminationId) {
      return;
    }

    this.refreshAvailableAppointments();
  }

  ngOnInit(): void {
    this.getDoctorExaminations();
  }

  scheduleAppointment(date: any) {
    if (
      !this.doctor?.id ||
      !this.authService.authDataValue?.id ||
      !this.selectedDate ||
      !this.selectedExaminationId
    )
      return;
    const appointment: AppointmentToAddOrUpdate = {
      date: date,
      status: AppointmentStatus.BOOKED,
      doctorId: this.doctor?.id,
      patientId: this.authService.authDataValue.id,
      examinationId: this.selectedExaminationId,
    };
    this.appointmentService
      .createAppointment(appointment)
      .subscribe((appointment: Appointment) => {
        if (!appointment) {
          this.toast.openFailureSnackBar({
            message: 'Failed to schedule appointment.',
          });
          return;
        }
        this.toast.openSuccessSnackBar({
          message: `Appointment scheduled successfully.`,
        });
        this.refreshAvailableAppointments();
      });
  }

  private formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd') + 'T23:59';
  }

  private refreshAvailableAppointments() {
    const appointmentDate: Date | undefined = this.selectedDate;
    if (!appointmentDate) return;

    this.getAvailableAppointments(this.selectedExaminationId, appointmentDate);
  }

  private getDoctorExaminations() {
    if (!this.doctor) return;

    this.examinationService
      .getDoctorExaminations(this.doctor.id)
      .subscribe(examinations => {
        console.log(examinations);

        if (!examinations) {
          this.toast.openFailureSnackBar({
            message: 'Failed to load doctor examinations.',
          });
          return;
        }
        this.doctorExaminations = examinations;
      });
  }

  private getAvailableAppointments(examinationId?: string, date?: Date) {
    if (!this.doctor?.id || !examinationId || !date) return;

    this.doctorService
      .getAvailableAppointments(
        this.doctor.id,
        examinationId,
        this.formatDate(date),
      )
      .subscribe((dates: AvailableAppointments[]) => {
        if (!dates) {
          this.toast.openFailureSnackBar({
            message: 'No available appointments for this date.',
          });
          return;
        }
        this.availableAppointmentDates = dates;
      });
  }
}
