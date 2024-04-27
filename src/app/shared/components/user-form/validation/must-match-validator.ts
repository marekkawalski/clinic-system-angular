import { AbstractControl, ValidatorFn } from '@angular/forms';

export default class Validation {
  static match(
    groupName: string,
    controlName: string,
    checkControlName: string,
  ): ValidatorFn {
    return (controls: AbstractControl) => {
      const group = controls.get(groupName);
      const control = group?.get(controlName);
      const checkControl = group?.get(checkControlName);

      if (!control || !checkControl) return null;

      if (checkControl.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control.value !== checkControl.value) {
        checkControl.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}
