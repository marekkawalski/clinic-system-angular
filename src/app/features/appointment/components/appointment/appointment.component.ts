import { Component } from '@angular/core';
import { FormType } from '../../../../shared/enums/FormType';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserFormComponent } from '../../../../shared/components/user-form/user-form.component';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

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

  constructor(public dialogRef: MatDialogRef<AppointmentComponent>) {}
}
