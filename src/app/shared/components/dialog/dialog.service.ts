import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogComponent } from './dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(component: any, data: any, options: any = {}): Observable<any> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: options.width || '500px',
      height: options.height || 'auto',
      data: { component, data },
    });

    return dialogRef.afterClosed();
  }
}
