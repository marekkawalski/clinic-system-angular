import { Component, Input, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../../../core/authentication/auth.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatButton } from '@angular/material/button';
import { DatePipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Examination } from '../../../../core/models/Examination';
import { ExaminationService } from '../../services/examination.service';
import { Doctor } from '../../../../core/models/Doctor';
import { MatNativeDateModule } from '@angular/material/core';
import { format } from 'date-fns';
import { AvailableAppointments } from '../../model/AvailableAppointments';

@Component({
  selector: 'app-schedule-appointment',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    NgForOf,
    MatFormField,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatInput,
    MatOption,
    MatSelect,
    MatLabel,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    JsonPipe,
    DatePipe,
  ],
  templateUrl: './schedule-appointment.component.html',
  styleUrl: './schedule-appointment.component.scss',
})
export class ScheduleAppointmentComponent implements OnInit {
  @Input() doctor?: Doctor;
  submitted = false;
  availableAppointmentDates: AvailableAppointments[] = [];

  scheduleAppointmentForm = this.formBuilder.group({
    date: this.formBuilder.nonNullable.control(<string | undefined>undefined, [
      Validators.required,
    ]),
    examinationId: this.formBuilder.nonNullable.control(
      <string | undefined>undefined,
      [Validators.required],
    ),
  });
  doctorExaminations: Examination[] = [];

  constructor(
    protected readonly doctorService: DoctorService,
    protected readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    protected readonly router: Router,
    private readonly toast: SnackbarService,
    private readonly examinationService: ExaminationService,
  ) {}

  get formControl() {
    return this.scheduleAppointmentForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.scheduleAppointmentForm.invalid) {
      return;
    }

    const appointmentDate = this.formControl.date.value;
    if (!appointmentDate) return;
    const formattedDate = format(appointmentDate, 'yyyy-MM-dd') + 'T23:59';

    this.getAvailableAppointments(
      this.formControl.examinationId.value,
      formattedDate,
    );
  }

  ngOnInit(): void {
    this.getDoctorExaminations();
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

  private getAvailableAppointments(examinationId?: string, date?: string) {
    if (!this.doctor?.id || !examinationId || !date) return;

    this.doctorService
      .getAvailableAppointments(this.doctor.id, examinationId, date)
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
