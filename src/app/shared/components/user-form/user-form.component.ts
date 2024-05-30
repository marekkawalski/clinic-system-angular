import { Component, Input, OnInit } from '@angular/core';
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
import { NgClass } from '@angular/common';
import { PathConstants } from '../../../core/constants/path.constants';
import { AuthService } from '../../../core/authentication/auth.service';
import { RegistrationService } from '../../../core/authentication/registration.service';
import { Address } from '../../../core/models/Address';
import { DoctorDetails } from '../../../core/models/DoctorDetails';
import { User } from '../../../core/models/user/User';
import { UserToAddOrUpdate } from '../../../core/models/user/UserToAddOrUpdate';
import { UserService } from '../../../core/services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormType } from '../../enums/FormType';

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
    NgClass
],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  @Input() userId?: string;
  @Input() dialogRef?: MatDialogRef<any>;
  @Input() action: string = 'Register';
  @Input() formType?: FormType = FormType.WholePageForm;

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
        password: this.formBuilder.control(undefined),
        confirmPassword: this.formBuilder.control(undefined),
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
  class?: string;
  protected readonly PathConstants = PathConstants;
  protected readonly UserRole = UserRole;
  protected readonly FormType = FormType;

  constructor(
    private readonly formBuilder: FormBuilder,
    protected readonly router: Router,
    protected readonly authenticationService: AuthService,
    protected readonly registrationService: RegistrationService,
    protected readonly userService: UserService,
    private readonly toast: SnackbarService,
  ) {}

  get formControl() {
    return this.registrationForm.controls;
  }

  ngOnInit(): void {
    this.initFormData();
    this.establishCssClass();
    this.initValidators();
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
      isEnabled: this.formControl.adminManagedData.controls.enabled.value,
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
        this.toast.openSuccessSnackBar({
          message: `User ${user.name} ${user.surname} has been registered`,
        });
      });
    } else {
      this.userService.updateUser(user, this.userId).subscribe((user: User) => {
        this.loading = false;
        this.toast.openSuccessSnackBar({
          message: `User ${user.name} ${user.surname} has been updated`,
        });
      });
    }
    if (this.formType === FormType.PopupForm) {
      this.dialogRef?.close(true);
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

  private establishCssClass(): void {
    if (this.formType === FormType.WholePageForm) {
      this.class = 'whole-page-form';
    } else if (this.formType === FormType.PopupForm) {
      this.class = 'popup-form';
    }
  }

  private initFormData() {
    if (!this.userId) return;

    this.userService.getUserById(this.userId).subscribe((user: User) => {
      if (!user) {
        this.toast.openFailureSnackBar({ message: 'User not found' });
        return;
      }

      this.registrationForm.patchValue({
        adminManagedData: {
          role: user.role,
          enabled: user.isEnabled,
        },
        address: {
          country: user.address.country,
          city: user.address.city,
          street: user.address.street,
          postalCode: user.address.postalCode,
          houseNumber: user.address.houseNumber,
          apartmentNumber: user.address.apartmentNumber,
        },
        basicData: {
          name: user.name,
          surname: user.surname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          pesel: user.pesel,
        },
        doctorDetails: {
          specialization: user.doctorDetails?.specialization,
          education: user.doctorDetails?.education,
          description: user.doctorDetails?.description,
        },
      });
    });
  }

  private initValidators() {
    this.formControl.basicData.controls.password.addValidators(
      this.userId
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
    );

    this.formControl.basicData.controls.confirmPassword.addValidators(
      this.userId ? [] : [Validators.required],
    );
  }
}
