import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { UserFormComponent } from '@app/shared/components/user-form/user-form.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [MatCard, UserFormComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {}
