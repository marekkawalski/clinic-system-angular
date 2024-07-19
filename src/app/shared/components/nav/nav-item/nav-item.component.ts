import { Component, Input } from '@angular/core';
import { PathConstants } from '@app/core/constants/path.constants';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/core/authentication/auth.service';
import { UserRole } from '@app/core/enums/UserRole';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [MatNavList, RouterLinkActive, RouterLink, MatListItem],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss',
})
export class NavItemComponent {
  @Input() listItemText?: string;
  @Input() listItemPath?: string;
  @Input() allowedRoles?: UserRole[];
  @Input() requireLogin = false;

  protected readonly PathConstants = PathConstants;
  protected readonly UserRole = UserRole;

  constructor(protected readonly authService: AuthService) {}

  checkAccess(): boolean {
    if (!this.requireLogin) {
      return true;
    }
    if (this.requireLogin && !this.authService.authDataValue) {
      return false;
    }
    if (!this.allowedRoles || this.allowedRoles.length === 0) {
      return true;
    }
    return this.authService.checkAccess(this.allowedRoles);
  }
}
