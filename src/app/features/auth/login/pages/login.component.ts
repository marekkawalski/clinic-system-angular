import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/authentication/auth.service';
import { first } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { PathConstants } from '../../../../core/constants/path.constants';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
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
  protected readonly PathConstants = PathConstants;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly authenticationService: AuthService,
    protected readonly snackBarService: SnackbarService,
  ) {}

  get formControl() {
    return this.loginForm?.controls;
  }

  public get router(): Router {
    return this._router;
  }

  ngOnInit(): void {}

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
        next: () => {
          this.router.navigate([PathConstants.HOME_PATH]).then(() => {
            console.log('Login successful');
            this.snackBarService.openSuccessSnackBar({
              message: 'Login successful',
            });
          });
        },
        error: error => {
          this.error = error;
          this.loading = false;
          console.log(error);
        },
      });
  }
}
