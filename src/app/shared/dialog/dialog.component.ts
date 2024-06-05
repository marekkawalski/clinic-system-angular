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
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { FormDialogComponent } from './models/formDialogComponent';
import { DialogData } from './models/dialogData';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [MatButton, MatDialogContent, MatDialogActions],
})
export class DialogComponent<T, TComponent extends FormDialogComponent<T>>
  implements OnInit
{
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  private componentRef?: ComponentRef<TComponent>;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent<T, TComponent>>,
    @Inject(MAT_DIALOG_DATA)
    public dialogComponentData: DialogData<T, TComponent>,
  ) {}

  ngOnInit() {
    try {
      this.componentRef = this.container.createComponent(
        this.dialogComponentData.component,
      );
      this.componentRef.instance.data = this.dialogComponentData.data;
      this.componentRef.instance.dialogRef = this.dialogRef;
    } catch (error) {
      console.error('Error creating component:', error);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    if (this.componentRef && this.componentRef.instance) {
      const form =
        this.componentRef.location.nativeElement.querySelector('form');
      if (form) {
        form.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
      } else {
        console.error('Form not found in component instance');
      }
    }
  }
}
