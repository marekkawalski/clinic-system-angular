import { Component, Input } from '@angular/core';
import { FormType } from '../../../../shared/enums/FormType';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss',
})
export class AppointmentFormComponent {
  @Input() dialogRef?: any;
  @Input() action?: string;
  @Input() formType?: FormType.PopupForm;

  appointmentForm = {};

  constructor() {}
}
