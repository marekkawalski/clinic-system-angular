import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface SnackbarConfig {
  message: string;
  action?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  openSuccessSnackBar(config: SnackbarConfig) {
    this.snackBar.open(config.message, config?.action ?? 'OK', {
      duration: config?.duration ?? 3000,
      panelClass: ['green-snackbar'],
    });
  }

  openFailureSnackBar(config: SnackbarConfig) {
    this.snackBar.open(config.message, config?.action ?? 'OK', {
      duration: config?.duration ?? 3000,
      panelClass: ['red-snackbar'],
    });
  }

  openInfoSnackBar(config: SnackbarConfig) {
    this.snackBar.open(config.message, config?.action ?? 'OK', {
      duration: config?.duration ?? 3000,
      panelClass: ['blue-snackbar'],
    });
  }
}
