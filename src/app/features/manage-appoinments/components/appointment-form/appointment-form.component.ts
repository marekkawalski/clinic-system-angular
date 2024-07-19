import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormType } from '@app/shared/enums/FormType';
import { MatDialogRef } from '@angular/material/dialog';
import { AppointmentService } from '@app/shared/services/appointment.service';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { Router } from '@angular/router';
import { Appointment } from '@app/core/models/appointment/Appointment';
import { AppointmentStatus } from '@app/core/enums/AppointmentStatus';
import { AppointmentToAddOrUpdate } from '@app/core/models/appointment/AppointmentToAddOrUpdate';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Medicine } from '@app/core/models/appointment/Medicine';
import { BaseDialogData } from '@app/shared/dialog/models/baseDialogData';

export interface AppointmentFormInput {
  appointment: Appointment;
  dialogRef: MatDialogRef<any>;
  action?: string;
  formType?: FormType;
}

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    MatCard,
    NgClass,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    MatLabel,
    MatButton,
    MatIcon,
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss',
})
export class AppointmentFormComponent
  implements OnInit, BaseDialogData<Appointment>
{
  @ViewChild('form') form!: HTMLFormElement;
  @Input({ required: true }) data?: AppointmentFormInput['appointment'];
  @Input({ required: true }) dialogRef?: AppointmentFormInput['dialogRef'];
  @Input({ required: false }) action?: AppointmentFormInput['action'] =
    'Edit appointment';
  @Input() formType: AppointmentFormInput['formType'] = FormType.PopupForm;

  class?: string;
  appointmentForm = this.formBuilder.group({
    status: this.formBuilder.nonNullable.control(
      <AppointmentStatus | undefined>undefined,
      {
        validators: [Validators.required],
      },
    ),
    description: this.formBuilder.control(<string | undefined>undefined),
    medicines: this.formBuilder.array([]),
  });
  protected readonly AppointmentStatus = AppointmentStatus;
  protected readonly FormType = FormType;

  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly toast: SnackbarService,
    private readonly formBuilder: FormBuilder,
    protected readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.initFormData();
  }

  onSubmit() {
    if (this.appointmentForm.invalid) {
      return;
    }
    this.updateAppointment();
    if (this.formType === FormType.PopupForm) {
      this.dialogRef?.close(true);
    }
  }

  addMedicine(medicine?: Medicine): void {
    const medicineGroup = this.formBuilder.group({
      name: medicine?.name ?? '',
      quantity: medicine?.quantity ?? '',
      numberOfDays: medicine?.numberOfDays ?? '',
      dosage: medicine?.dosage ?? '',
    });

    const medicineArray = this.appointmentForm.get('medicines') as FormArray;
    medicineArray.push(medicineGroup);
  }

  getMedicines(): FormArray {
    return this.appointmentForm.get('medicines') as FormArray;
  }

  private initFormData() {
    if (!this.data) {
      return;
    }
    this.appointmentForm.patchValue({
      status: this.data.status,
      description: this.data.description,
    });

    for (const medicine of this.data?.medicines ?? []) {
      this.addMedicine(medicine);
    }
  }

  private updateAppointment() {
    if (!this.data?.id || !this.appointmentForm.value.status) {
      return;
    }

    const appointmentToUpdate: AppointmentToAddOrUpdate = {
      date: this.data.date,
      description: this.appointmentForm.value.description ?? '',
      doctorId: this.data.doctor.id,
      examinationId: this.data.examination.id,
      patientId: this.data.patient.id,
      status: this.appointmentForm.value.status,
    };
    if (this.appointmentForm.value.medicines) {
      appointmentToUpdate.medicines = this.appointmentForm.value
        .medicines as Medicine[];
    }
    this.appointmentService
      .updateAppointment(appointmentToUpdate, this.data.id)
      .subscribe(appointment => {
        if (!appointment) {
          this.toast.openFailureSnackBar({
            message: 'Appointment update failed.',
          });
          return;
        }
        this.toast.openSuccessSnackBar({
          message: 'Appointment updated successfully.',
        });
      });
  }
}
