import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { User } from '@app/core/models/user/User';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { UserFormComponent } from '@app/shared/components/user-form/user-form.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { FormType } from '@app/shared/enums/FormType';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    MatDialogContent,
    UserFormComponent,
    MatDialogTitle,
    MatDialogActions,
    MatIcon,
    MatButton,
    MatDialogClose,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EditUserComponent {
  protected readonly FormType = FormType;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      user: User;
    },
    public dialogRef: MatDialogRef<EditUserComponent>,
  ) {}
}
