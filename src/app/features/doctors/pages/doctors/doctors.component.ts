import { Component } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatAnchor, MatButton } from '@angular/material/button';
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { UserPageRequestParams } from '../../../../shared/models/UserPageRequestParams';
import { DoctorService } from '../../services/doctor.service';
import { MatIcon } from '@angular/material/icon';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { PageRequestParams } from '../../../../shared/models/PageRequestParams';
import { RouterLink } from '@angular/router';
import { PathConstants } from '../../../../core/constants/path.constants';
import { UserRole } from '../../../../core/enums/UserRole';
import { AuthService } from '../../../../core/authentication/auth.service';
import { MatNavList } from '@angular/material/list';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatCardImage,
    NgOptimizedImage,
    MatCardTitle,
    MatCardSubtitle,
    NgIf,
    AsyncPipe,
    NgForOf,
    MatIcon,
    PaginatorComponent,
    RouterLink,
    MatAnchor,
    MatNavList,
  ],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss',
})
export class DoctorsComponent {
  userRequestParams: UserPageRequestParams = {};
  doctors = this.doctorService.getPagedDoctors(this.userRequestParams);
  protected readonly PathConstants = PathConstants;
  protected readonly UserRole = UserRole;

  constructor(
    protected readonly doctorService: DoctorService,
    protected readonly authService: AuthService,
  ) {}

  getPagedDoctors($event: PageRequestParams) {
    this.doctors = this.doctorService.getPagedDoctors($event);
  }
}
