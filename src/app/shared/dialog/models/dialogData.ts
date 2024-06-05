import { DialogOptions } from './dialogOptions';
import { Type } from '@angular/core';

export interface DialogData<T, TComponent> {
  component: Type<TComponent>;
  options?: DialogOptions;
  data: T;
}
