import { UserFormValidationConstants } from './user-form-validation.constants';

interface ValidationMessage {
  [key: string]: { type: string; message: string }[];
}

export const Registration_Validation_Messages: ValidationMessage = {
  name: [
    { type: 'required', message: 'Name is required' },
    {
      type: 'minlength',
      message: `Name must be at least ${UserFormValidationConstants.MIN_NAME_LENGTH} characters long`,
    },
    {
      type: 'maxlength',
      message: `Name cannot be more than ${UserFormValidationConstants.MAX_NAME_LENGTH} characters long`,
    },
  ],
  surname: [
    { type: 'required', message: 'Surname is required' },
    {
      type: 'minlength',
      message: `Surname must be at least ${UserFormValidationConstants.MIN_SURNAME_LENGTH} characters long`,
    },
    {
      type: 'maxlength',
      message: `Surname cannot be more than ${UserFormValidationConstants.MAX_SURNAME_LENGTH} characters long`,
    },
  ],
  phoneNumber: [
    {
      type: 'minlength',
      message: `Phone number must be at least ${UserFormValidationConstants.MIN_PHONE_NUMBER_LENGTH} characters long`,
    },
    {
      type: 'maxlength',
      message: `Phone number cannot be more than ${UserFormValidationConstants.MAX_PHONE_NUMBER_LENGTH} characters long`,
    },
  ],
  email: [
    { type: 'required', message: 'Email is required' },
    { type: 'email', message: 'Enter a valid email' },
  ],
  pesel: [
    { type: 'required', message: 'PESEL is required' },
    {
      type: 'minlength',
      message: `PESEL must be ${UserFormValidationConstants.PESEL_LENGTH} characters long`,
    },
    {
      type: 'maxlength',
      message: `PESEL must be ${UserFormValidationConstants.PESEL_LENGTH} characters long`,
    },
  ],
  password: [
    { type: 'required', message: 'Password is required' },
    {
      type: 'minlength',
      message: `Password must be at least ${UserFormValidationConstants.MIN_PASSWORD_LENGTH} characters long`,
    },
    {
      type: 'maxlength',
      message: `Password cannot be more than ${UserFormValidationConstants.MAX_PASSWORD_LENGTH} characters long`,
    },
  ],
  confirmPassword: [
    { type: 'required', message: 'Confirm password is required' },
    { type: 'matching', message: 'Password mismatch' },
  ],
  country: [{ type: 'required', message: 'Country is required' }],
  city: [{ type: 'required', message: 'City is required' }],
  street: [{ type: 'required', message: 'Street is required' }],
  postalCode: [{ type: 'required', message: 'Postal code is required' }],
  houseNumber: [{ type: 'required', message: 'House number is required' }],
};
