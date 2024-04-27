import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserRole } from '../../../core/enums/UserRole';
import { Registration_Validation_Messages } from './validation/validation-messages';
import { UserFormValidationConstants } from './validation/user-form-validation.constants';
import { Router } from '@angular/router';
import { PasswordStrengthValidator } from './validation/password-validator';
import Validation from './validation/must-match-validator';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { NgForOf, NgIf } from '@angular/common';
import { PathConstants } from '../../../core/constants/path.constants';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatFormFieldModule,
    MatButton,
    MatInput,
    MatCheckbox,
    MatSelect,
    MatOption,
    MatCardContent,
    MatCardTitle,
    MatCard,
    NgIf,
    NgForOf,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
  registrationValidationMessages = Registration_Validation_Messages;

  registrationForm = this.formBuilder.group(
    {
      basicData: this.formBuilder.group({
        name: this.formBuilder.nonNullable.control('', {
          validators: [
            Validators.required,
            Validators.minLength(UserFormValidationConstants.MIN_NAME_LENGTH),
            Validators.maxLength(UserFormValidationConstants.MAX_NAME_LENGTH),
          ],
        }),
        surname: this.formBuilder.nonNullable.control('', {
          validators: [
            Validators.required,
            Validators.minLength(
              UserFormValidationConstants.MIN_SURNAME_LENGTH,
            ),
            Validators.maxLength(
              UserFormValidationConstants.MAX_SURNAME_LENGTH,
            ),
          ],
        }),
        email: this.formBuilder.nonNullable.control('', {
          validators: [Validators.required, Validators.email],
        }),
        phoneNumber: this.formBuilder.nonNullable.control('', {
          validators: [
            Validators.minLength(
              UserFormValidationConstants.MIN_PHONE_NUMBER_LENGTH,
            ),
            Validators.maxLength(
              UserFormValidationConstants.MAX_PHONE_NUMBER_LENGTH,
            ),
          ],
        }),
        pesel: this.formBuilder.nonNullable.control('', {
          validators: [
            Validators.required,
            Validators.minLength(UserFormValidationConstants.PESEL_LENGTH),
            Validators.maxLength(UserFormValidationConstants.PESEL_LENGTH),
          ],
        }),
        password: this.formBuilder.nonNullable.control('', {
          validators: this.router.url.includes(PathConstants.MANAGE_USERS_PATH)
            ? [
                PasswordStrengthValidator,
                Validators.minLength(
                  UserFormValidationConstants.MIN_PASSWORD_LENGTH,
                ),
                Validators.maxLength(
                  UserFormValidationConstants.MAX_PASSWORD_LENGTH,
                ),
              ]
            : [
                Validators.required,
                PasswordStrengthValidator,
                Validators.minLength(
                  UserFormValidationConstants.MIN_PASSWORD_LENGTH,
                ),
                Validators.maxLength(
                  UserFormValidationConstants.MAX_PASSWORD_LENGTH,
                ),
              ],
        }),
        confirmPassword: this.formBuilder.nonNullable.control('', {
          validators: this.router.url.includes(PathConstants.MANAGE_USERS_PATH)
            ? []
            : [Validators.required],
        }),
      }),
      adminManagedData: this.formBuilder.group({
        enabled: this.formBuilder.nonNullable.control(true),
        role: this.formBuilder.nonNullable.control(UserRole.PATIENT),
      }),
      address: this.formBuilder.group({
        country: this.formBuilder.nonNullable.control('', {
          validators: [Validators.required],
        }),
        city: this.formBuilder.nonNullable.control('', {
          validators: [Validators.required],
        }),
        street: this.formBuilder.nonNullable.control('', {
          validators: [Validators.required],
        }),
        postalCode: this.formBuilder.nonNullable.control('', {
          validators: [Validators.required],
        }),
        houseNumber: this.formBuilder.nonNullable.control('', {
          validators: [Validators.required],
        }),
        apartmentNumber: this.formBuilder.control('', {
          validators: [],
        }),
      }),
    },
    {
      validators: [
        Validation.match('basicData', 'password', 'confirmPassword'),
      ],
    },
  );
  submitted: boolean = false;
  protected readonly PathConstants = PathConstants;

  constructor(
    private readonly formBuilder: FormBuilder,
    protected readonly router: Router,
  ) {}

  get formControl() {
    return this.registrationForm.controls;
  }

  onSubmit() {
    this.submitted = true;
  }

  getErrorMessage(controlGroup: string, fieldName: string) {
    const fieldControl = this.registrationForm.get(
      `${controlGroup}.${fieldName}`,
    );

    if (!fieldControl?.errors) return null;

    const foundError = Object.keys(fieldControl.errors)
      .map(key => {
        return this.registrationValidationMessages[fieldName].find(
          (item: any) => item.type === key,
        );
      })
      .find((v: any) => v);

    return foundError ? foundError.message : null;
  }

  getPasswordErrorMessage() {
    const passwordControl = this.registrationForm.get('basicData.password');

    if (!passwordControl?.errors) return null;

    // check for passwordStrength error
    if (passwordControl.errors['passwordStrength']) {
      return passwordControl.errors['passwordStrength'];
    }

    // check for other errors
    const foundError = Object.keys(passwordControl.errors)
      .map(key => {
        return this.registrationValidationMessages['password'].find(
          item => item.type === key,
        );
      })
      .find(v => v);

    return foundError ? foundError.message : null;
  }
}
