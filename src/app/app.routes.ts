import { Routes } from '@angular/router';
import { HomepageComponent } from './features/homepage/pages/homepage/homepage.component';
import { LoginComponent } from './features/auth/login/pages/login.component';
import { PathConstants } from './core/constants/path.constants';
import { RegistrationComponent } from './features/auth/registration/pages/registration.component';

export const routes: Routes = [
  { path: PathConstants.HOME_PATH, component: HomepageComponent },
  { path: PathConstants.LOGIN_PATH, component: LoginComponent },
  { path: PathConstants.REGISTER_PATH, component: RegistrationComponent },

  { path: '**', redirectTo: '' },
];
