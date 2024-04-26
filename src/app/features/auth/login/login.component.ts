import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';
import { first } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    NgIf,
    MatInput,
    MatIconButton,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loading = false;
  submitted = false;
  error = '';
  hide = true;
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly authenticationService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.authenticationService.authData) {
      this.router.navigate(['/']);
    }
  }

  get formControl() {
    return this.loginForm?.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm?.invalid) return;

    this.loading = true;
    this.authenticationService
      .login(
        this.formControl?.['email'].value,
        this.formControl?.['password'].value,
      )
      .pipe(first())
      .subscribe({
        next: () => this.router.navigate(['']),
        error: error => {
          this.error = error;
          this.loading = false;
          console.log(error);
        },
      });
  }

  public get router(): Router {
    return this._router;
  }
}
