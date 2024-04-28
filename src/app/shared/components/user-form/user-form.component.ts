import { Component, Input } from '@angular/core';
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
import { AuthService } from '../../../core/authentication/auth.service';
import { RegistrationService } from '../../../core/authentication/registration.service';
import { Address } from '../../../core/models/Address';
import { DoctorDetails } from '../../../core/models/DoctorDetails';
import { User } from '../../../core/models/user/User';
import { UserToAddOrUpdate } from '../../../core/models/user/UserToAddOrUpdate';
import { UserService } from '../../services/user.service';

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
  @Input() userId?: string;

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
      doctorDetails: this.formBuilder.group({
        specialization: this.formBuilder.control('', {}),
        education: this.formBuilder.control('', {}),
        description: this.formBuilder.control('', {}),
      }),
    },
    {
      validators: [
        Validation.match('basicData', 'password', 'confirmPassword'),
      ],
    },
  );
  submitted: boolean = false;
  loading: boolean = false;
  protected readonly PathConstants = PathConstants;
  protected readonly UserRole = UserRole;

  constructor(
    private readonly formBuilder: FormBuilder,
    protected readonly router: Router,
    protected readonly authenticationService: AuthService,
    protected readonly registrationService: RegistrationService,
    protected readonly userService: UserService,
  ) {}

  get formControl() {
    return this.registrationForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (
      !this.formControl.adminManagedData.valid ||
      !this.formControl.basicData.valid ||
      !this.formControl.address.valid
    ) {
      return;
    }

    this.loading = true;

    const address: Address = {
      country: this.formControl.address.controls.country.value,
      city: this.formControl.address.controls.city.value,
      street: this.formControl.address.controls.street.value,
      postalCode: this.formControl.address.controls.postalCode.value,
      houseNumber: this.formControl.address.controls.houseNumber.value,
    };
    if (this.formControl.address.controls.apartmentNumber.value) {
      address.apartmentNumber =
        this.formControl.address.controls.apartmentNumber.value;
    }

    const doctorDetails: DoctorDetails = {};
    if (this.formControl.doctorDetails.controls.specialization.value) {
      doctorDetails.specialization =
        this.formControl.doctorDetails.controls.specialization.value;
    }
    if (this.formControl.doctorDetails.controls.education.value) {
      doctorDetails.education =
        this.formControl.doctorDetails.controls.education.value;
    }
    if (this.formControl.doctorDetails.controls.description.value) {
      doctorDetails.description =
        this.formControl.doctorDetails.controls.description.value;
    }

    const user: UserToAddOrUpdate = {
      name: this.formControl.basicData.controls.name.value,
      surname: this.formControl.basicData.controls.surname.value,
      email: this.formControl.basicData.controls.email.value,
      pesel: this.formControl.basicData.controls.pesel.value,
      phoneNumber: this.formControl.basicData.controls.phoneNumber.value,
      address: address,
      role: this.formControl.adminManagedData.controls.role.value,
    };

    if (!Object.is(doctorDetails, {})) {
      user.doctorDetails = doctorDetails;
    }

    if (this.formControl.basicData.controls.password.value) {
      user.password = this.formControl.basicData.controls.password.value;
    }

    if (!this.userId) {
      this.registrationService.register(user).subscribe((user: User) => {
        this.loading = false;
        console.log(`User ${user.email} has been registered`);
      });
    } else {
      this.userService.updateUser(user, this.userId).subscribe((user: User) => {
        this.loading = false;
        console.log(`User ${user.email} has been updated`);
      });
    }
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
        return this.registrationValidationMessages['password']?.find(
          item => item.type === key,
        );
      })
      .find(v => v);

    return foundError ? foundError.message : null;
  }
}
