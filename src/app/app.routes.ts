import { Routes } from '@angular/router';
import { HomepageComponent } from './features/homepage/pages/homepage/homepage.component';
import { LoginComponent } from './features/auth/login/pages/login.component';
import { PathConstants } from './core/constants/path.constants';
import { RegistrationComponent } from './features/auth/registration/pages/registration.component';
import { ManageUsersPageComponent } from './features/manage-users/pages/manage-users-page/manage-users-page.component';
import { authGuard } from './core/authentication/auth.guard';
import { UserRole } from './core/enums/UserRole';
import { DoctorsComponent } from './features/doctors/pages/doctors/doctors.component';
import { DoctorDetailsComponent } from './features/doctors/pages/doctor-details/doctor-details.component';

export const routes: Routes = [
  { path: PathConstants.HOME_PATH, component: HomepageComponent },
  { path: PathConstants.LOGIN_PATH, component: LoginComponent },
  { path: PathConstants.REGISTER_PATH, component: RegistrationComponent },
  { path: PathConstants.DOCTORS_PATH, component: DoctorsComponent },
  {
    path: PathConstants.DOCTOR_DETAILS_PATH,
    component: DoctorDetailsComponent,
  },

  //Admin routes
  {
    path: PathConstants.MANAGE_USERS_PATH,
    component: ManageUsersPageComponent,
    canActivate: [authGuard],
    data: {
      expectedRoles: <UserRole[]>[UserRole.ADMIN],
    },
  },

  { path: '**', redirectTo: '' },
];
