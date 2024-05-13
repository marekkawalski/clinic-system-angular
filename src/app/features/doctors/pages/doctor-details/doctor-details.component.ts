import { Component, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Doctor } from '../../../../core/models/Doctor';
import { DoctorService } from '../../services/doctor.service';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { CapitalizeSpaceBetweenPipe } from '../../../../shared/pipes/capitalize-space-between.pipe';
import { DatePipe } from '../../../../shared/pipes/date.pipe';
import { LastPropertyPipe } from '../../../../shared/pipes/last-property.pipe';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { DoctorInfoComponent } from '../../components/doctor-info/doctor-info.component';
import { ExaminationsComponent } from '../../components/examinations/examinations.component';
import { DoctorScheduleComponent } from '../../components/doctor-schedule/doctor-schedule.component';
import { ScheduleAppointmentComponent } from '../../components/schedule-appointment/schedule-appointment.component';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    NgForOf,
    NgIf,
    RouterLink,
    AsyncPipe,
    FooterComponent,
    MatTabGroup,
    MatTab,
    MatTable,
    CapitalizeSpaceBetweenPipe,
    DatePipe,
    LastPropertyPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatHeaderCellDef,
    JsonPipe,
    PaginatorComponent,
    DoctorInfoComponent,
    ExaminationsComponent,
    DoctorScheduleComponent,
    ScheduleAppointmentComponent,
  ],
  templateUrl: './doctor-details.component.html',
  styleUrl: './doctor-details.component.scss',
})
export class DoctorDetailsComponent implements OnInit {
  doctor$?: Observable<Doctor>;

  constructor(
    protected readonly doctorService: DoctorService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.doctor$ = this.doctorService.getDoctorByEmail(params['email']);
    });
  }
}
