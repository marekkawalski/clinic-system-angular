import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../core/authentication/auth.service';
import { PathConstants } from '../../../core/constants/path.constants';
import { UserRole } from '../../../core/enums/UserRole';
import { NavItemComponent } from './nav-item/nav-item.component';

interface NavItem {
  listItemText: string;
  listItemPath: string;
  allowedRoles?: UserRole[];
  requireLogin: boolean;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    NgTemplateOutlet,
    RouterLinkActive,
    RouterLink,
    MatListItem,
    MatNavList,
    MatToolbar,
    MatIcon,
    AsyncPipe,
    NavItemComponent,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  navItems: NavItem[] = [
    {
      listItemText: 'Home',
      listItemPath: PathConstants.HOME_PATH,
      requireLogin: false,
    },
    {
      listItemText: 'Doctors',
      listItemPath: PathConstants.DOCTORS_PATH,
      requireLogin: false,
    },
    {
      listItemText: 'My appointments',
      listItemPath: PathConstants.MY_APPOINTMENTS_PATH,
      requireLogin: true,
    },
    {
      listItemText: 'Manage Users',
      listItemPath: PathConstants.MANAGE_USERS_PATH,
      requireLogin: true,
      allowedRoles: [UserRole.ADMIN, UserRole.REGISTRAR, UserRole.DOCTOR],
    },
    {
      listItemText: 'Manage Appointments',
      listItemPath: `manage-appointments/' + ${this.authService.authDataValue?.id}`,
      requireLogin: true,
      allowedRoles: [UserRole.DOCTOR],
    },
  ];

  protected readonly PathConstants = PathConstants;
  protected readonly UserRole = UserRole;

  constructor(protected readonly authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
