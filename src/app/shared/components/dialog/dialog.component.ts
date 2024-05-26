import {
  Component,
  ComponentRef,
  Inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { DialogComponentInterface } from './DialogComponentInterface';

@Component({
  selector: 'app-dialog',
  templateUrl: `./dialog.component.html`,
  standalone: true,
  imports: [MatDialogActions, MatButton, MatDialogContent, MatDialogTitle],
})
export class DialogComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container?: ViewContainerRef;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private viewContainerRef: ViewContainerRef,
  ) {}

  ngOnInit() {
    if (!this.container) {
      return;
    }
    const componentRef: ComponentRef<DialogComponentInterface> =
      this.container.createComponent(this.data.component);
    componentRef.instance.data = this.data.data;
    componentRef.instance.dialogRef = this.dialogRef;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    const formRef =
      this.viewContainerRef.element.nativeElement.querySelector('form');
    if (formRef) {
      formRef.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true }),
      );
    }
  }
}
