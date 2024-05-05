import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserFormComponent } from '../../../../shared/components/user-form/user-form.component';
import { FormType } from '../../../../shared/enums/FormType';

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
})
export class AddUserComponent {
  protected readonly FormType = FormType;

  constructor(public dialogRef: MatDialogRef<AddUserComponent>) {}
}
