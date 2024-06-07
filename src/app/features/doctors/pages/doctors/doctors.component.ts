import { Component, OnInit } from '@angular/core';
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
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
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
import { SpinnerService } from '../../../../shared/spinner/spinner.service';
import { Observable } from 'rxjs';
import { Doctor } from '../../../../core/models/Doctor';
import { PageRequestResponseData } from '../../../../shared/models/PageRequestResponseData';

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
    AsyncPipe,
    MatIcon,
    PaginatorComponent,
    RouterLink,
    MatAnchor,
    MatNavList,
  ],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss',
})
export class DoctorsComponent implements OnInit {
  userRequestParams: UserPageRequestParams = {};
  doctors$?: Observable<PageRequestResponseData<Doctor>>;
  protected readonly PathConstants = PathConstants;
  protected readonly UserRole = UserRole;

  constructor(
    protected readonly doctorService: DoctorService,
    protected readonly authService: AuthService,
    protected readonly spinnerService: SpinnerService,
  ) {}

  ngOnInit(): void {
    this.loadDoctors(this.userRequestParams);
  }

  getPagedDoctors($event: PageRequestParams) {
    this.loadDoctors($event);
  }

  private loadDoctors(params: PageRequestParams) {
    this.spinnerService.show();
    this.doctors$ = this.doctorService.getPagedDoctors(params);
    this.doctors$.subscribe(() => this.spinnerService.hide());
  }
}
