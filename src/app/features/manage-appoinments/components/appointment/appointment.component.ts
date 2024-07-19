import { Component, Inject } from '@angular/core';
import { FormType } from '@app/shared/enums/FormType';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserFormComponent } from '@app/shared/components/user-form/user-form.component';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { Appointment } from '@app/core/models/appointment/Appointment';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    UserFormComponent,
    AppointmentFormComponent,
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
})
export class AppointmentComponent {
  protected readonly FormType = FormType;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      appointment: Appointment;
    },
    public dialogRef: MatDialogRef<AppointmentComponent>,
  ) {}
}
