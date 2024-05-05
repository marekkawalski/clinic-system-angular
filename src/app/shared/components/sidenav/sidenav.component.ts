import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../core/authentication/auth.service';
import { PathConstants } from '../../../core/constants/path.constants';
import { UserRole } from '../../../core/enums/UserRole';

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
    NgIf,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  protected readonly PathConstants = PathConstants;
  protected readonly UserRole = UserRole;

  constructor(protected readonly authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
