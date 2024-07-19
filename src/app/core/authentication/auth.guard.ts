import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { UserRole } from '../enums/UserRole';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { User } from '../models/user/User';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean => {
  const authenticationService: AuthService = inject(AuthService);
  const toast: SnackbarService = inject(SnackbarService);
  const user: User | null = authenticationService.authDataValue;
  const expectedRoles: UserRole[] = route.data['expectedRoles'];

  if (state.url !== '/') {
    authenticationService.redirectUrl = state.url;
  }

  if (!user) {
    toast.openFailureSnackBar({
      message: 'Login to access this page.',
    });
    authenticationService.logout();
    return false;
  }

  if ((expectedRoles && expectedRoles.includes(user.role)) || !expectedRoles) {
    return true;
  }

  if (expectedRoles && !expectedRoles.includes(user.role)) {
    toast.openFailureSnackBar({
      message: 'You are not authorized to enter this route!',
    });
  }

  authenticationService.logout();
  return false;
};
