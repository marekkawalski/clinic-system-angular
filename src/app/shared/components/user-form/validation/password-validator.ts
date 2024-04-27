import { AbstractControl, ValidationErrors } from '@angular/forms';

export const PasswordStrengthValidator = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value: string = control.value || '';
  if (!value) {
    return null;
  }

  let errorMessage = '';

  const upperCaseCharacters = /[A-Z]+/g;
  if (!upperCaseCharacters.test(value)) {
    errorMessage += 'uppercase character, ';
  }

  const lowerCaseCharacters = /[a-z]+/g;
  if (!lowerCaseCharacters.test(value)) {
    errorMessage += 'lower case character, ';
  }

  const numberCharacters = /[0-9]+/g;
  if (!numberCharacters.test(value)) {
    errorMessage += 'number, ';
  }

  const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (!specialCharacters.test(value)) {
    errorMessage += 'special character, ';
  }

  if (errorMessage === '') {
    return null;
  } else
    return {
      passwordStrength: 'Missing: ' + errorMessage.replace(/,\s*$/, ''),
    };
};
