import { Component, Input, OnInit } from '@angular/core';
import { FormType } from '../../../../shared/enums/FormType';
import { MatDialogRef } from '@angular/material/dialog';
import { AppointmentService } from '../../../../shared/services/appointment.service';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Router } from '@angular/router';
import { Appointment } from '../../../../core/models/appointment/Appointment';
import { AppointmentStatus } from '../../../../core/enums/AppointmentStatus';
import { AppointmentToAddOrUpdate } from '../../../../core/models/appointment/AppointmentToAddOrUpdate';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Medicine } from '../../../../core/models/appointment/Medicine';
import { DialogComponentInterface } from '../../../../shared/components/dialog/DialogComponentInterface';

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
    MatIcon
],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss',
})
export class AppointmentFormComponent
  implements OnInit, DialogComponentInterface
{
  @Input() appointment?: Appointment;
  @Input() dialogRef?: MatDialogRef<any>;
  @Input() action?: string;
  @Input() formType?: FormType = FormType.PopupForm;
  class?: string;
  appointmentForm = this.formBuilder.group({
    date: this.formBuilder.nonNullable.control(<string | undefined>undefined, {
      validators: [Validators.required],
    }),
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

  get formControl() {
    return this.appointmentForm.controls;
  }

  ngOnInit(): void {
    this.initFormData();
    this.establishCssClass();
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
    if (!this.appointment) {
      return;
    }
    this.appointmentForm.patchValue({
      date: this.appointment.date.toISOString(),
      status: this.appointment.status,
      description: this.appointment.description,
    });

    for (const medicine of this.appointment?.medicines ?? []) {
      this.addMedicine(medicine);
    }
  }

  private updateAppointment() {
    if (
      !this.appointment?.id ||
      !this.appointmentForm.value.date ||
      !this.appointmentForm.value.status
    ) {
      return;
    }

    const appointmentToUpdate: AppointmentToAddOrUpdate = {
      date: this.appointmentForm.value.date,
      description: this.appointmentForm.value.description ?? '',
      doctorId: this.appointment.doctor.id,
      examinationId: this.appointment.examination.id,
      patientId: this.appointment.patient.id,
      status: this.appointmentForm.value.status,
    };
    if (this.appointmentForm.value.medicines) {
      appointmentToUpdate.medicines = this.appointmentForm.value
        .medicines as Medicine[];
    }
    this.appointmentService
      .updateAppointment(appointmentToUpdate, this.appointment.id)
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

  private establishCssClass(): void {
    if (this.formType === FormType.WholePageForm) {
      this.class = 'whole-page-form';
    } else if (this.formType === FormType.PopupForm) {
      this.class = 'popup-form';
    }
  }
}
