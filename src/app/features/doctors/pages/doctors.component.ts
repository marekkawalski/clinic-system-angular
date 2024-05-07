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
import { MatButton } from '@angular/material/button';
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { UserPageRequestParams } from '../../../core/models/UserPageRequestParams';
import { DoctorService } from '../services/doctor.service';
import { MatIcon } from '@angular/material/icon';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { PageRequestParams } from '../../../shared/models/PageRequestParams';

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
  ],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss',
})
export class DoctorsComponent {
  userRequestParams: UserPageRequestParams = {};
  doctors = this.doctorService.getPagedDoctors(this.userRequestParams);

  constructor(protected readonly doctorService: DoctorService) {}

  getPagedDoctors($event: PageRequestParams) {
    this.doctors = this.doctorService.getPagedDoctors($event);
  }
}
