import { MatDialogRef } from '@angular/material/dialog';

export interface BaseDialogData<T> {
  data?: T;
  dialogRef?: MatDialogRef<any>;
}
