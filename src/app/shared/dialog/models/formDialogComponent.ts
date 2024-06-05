import { BaseDialogData } from './baseDialogData';

export interface FormDialogComponent<T> extends BaseDialogData<T> {
  form: HTMLFormElement;
}
