import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '../../../shared/pipes/date.pipe';
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
  MatTableDataSource,
} from '@angular/material/table';

import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { MatPaginator } from '@angular/material/paginator';
import { Appointment } from '../../../core/models/appointment/Appointment';
import { PageRequestResponseData } from '../../../shared/models/PageRequestResponseData';
import { TableHelper } from '../../../shared/helpers/tableHelper';
import { PageRequestParams } from '../../../shared/models/PageRequestParams';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { ActivatedRoute } from '@angular/router';
import { AppointmentPageRequestParams } from '../../../shared/models/AppointmentPageRequestParams';
import { AuthService } from '../../../core/authentication/auth.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { AppointmentStatus } from '../../../core/enums/AppointmentStatus';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [
    DatePipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatTable,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    PaginatorComponent,
    MatRow,
    MatIcon,
    MatIconButton
],
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.scss',
})
export class MyAppointmentsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  dataSource: MatTableDataSource<Appointment> =
    new MatTableDataSource<Appointment>();
  pageAppointmentResponseData?: PageRequestResponseData<Appointment>;
  tableHelper = new TableHelper();
  requestParams: PageRequestParams = {};
  doctorId?: string;

  constructor(
    private readonly toast: SnackbarService,
    private readonly dialog: MatDialog,
    private readonly appointmentService: AppointmentService,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.getPagedAppointments(this.requestParams);
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  getPagedAppointments(params: AppointmentPageRequestParams) {
    const userId = this.authService.authDataValue?.id;
    if (!userId) {
      return;
    }
    this.appointmentService
      .getPagedPatientAppointments(params, userId)
      .subscribe(
        (requestResponseData: PageRequestResponseData<Appointment>) => {
          if (!requestResponseData) {
            this.toast.openInfoSnackBar({
              message: 'No appointments found.',
            });
            return;
          }
          this.dataSource = new MatTableDataSource(requestResponseData.content);
          this.pageAppointmentResponseData = requestResponseData;

          this.tableHelper.setSpecifiedBaseColumnNamesFromRequestData(
            this.pageAppointmentResponseData,
            [
              'examination.name',
              'date',
              'doctor.email',
              'status',
              'examination.price',
              'examination.duration',
            ],
            {
              date: 'Date',
              status: 'Status',
              'examination.name': 'Examination',
              'doctor.email': 'Doctor',
              'examination.price': 'Price',
              'examination.duration': 'Duration',
            },
          );
          this.tableHelper.setAllColumnNames(['cancel']);
        },
      );
  }

  cancelAppointment(appointment: Appointment) {
    if (appointment.date < new Date()) {
      this.toast.openFailureSnackBar({
        message: 'You cannot cancel an appointment that has already passed.',
      });
      return;
    }
    this.appointmentService
      .updateAppointment(
        {
          date: appointment.date.toISOString(),
          description: appointment.description,
          doctorId: appointment.doctor.id,
          examinationId: appointment.examination.id,
          medicines: appointment.medicines,
          patientId: appointment.patient.id,
          status: AppointmentStatus.CANCELLED,
        },
        appointment.id,
      )
      .subscribe(() => {
        this.toast.openSuccessSnackBar({
          message: 'Appointment cancelled successfully.',
        });
        this.getPagedAppointments(this.requestParams);
      });
  }
}
