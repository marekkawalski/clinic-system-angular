import { Injectable, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormDialogComponent } from './models/formDialogComponent';
import { DialogOptions } from './models/dialogOptions';
import { DialogComponent } from './dialog.component';
import { DialogData } from './models/dialogData';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog<TData, TComponent extends FormDialogComponent<TData>>(
    component: Type<TComponent>,
    data: TData,
    options: DialogOptions = {},
  ): Observable<any> {
    const dialogRef = this.dialog.open(DialogComponent<TData, TComponent>, {
      width: options.width || '500px',
      height: options.height || 'auto',
      data: { component, data, options } as DialogData<TData, TComponent>,
    });

    console.log('Dialog opened with data:', { component, data, options });

    return dialogRef.afterClosed();
  }
}
