import { Component, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserFormComponent } from '@app/shared/components/user-form/user-form.component';
import { FormType } from '@app/shared/enums/FormType';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    UserFormComponent,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AddUserComponent {
  protected readonly FormType = FormType;

  constructor(public dialogRef: MatDialogRef<AddUserComponent>) {}
}
