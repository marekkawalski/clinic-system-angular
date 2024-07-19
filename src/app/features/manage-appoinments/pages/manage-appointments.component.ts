import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CapitalizeSpaceBetweenPipe } from '@app/shared/pipes/capitalize-space-between.pipe';
import { DatePipe } from '@app/shared/pipes/date.pipe';
import { LastPropertyPipe } from '@app/shared/pipes/last-property.pipe';
import { MatButton, MatIconButton } from '@angular/material/button';
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

import { PaginatorComponent } from '@app/shared/components/paginator/paginator.component';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { PageRequestResponseData } from '@app/shared/models/PageRequestResponseData';
import { TableHelper } from '@app/shared/helpers/tableHelper';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from '@app/core/models/appointment/Appointment';
import { PageRequestParams } from '@app/shared/models/PageRequestParams';
import { AppointmentService } from '@app/shared/services/appointment.service';
import { AppointmentPageRequestParams } from '@app/shared/models/AppointmentPageRequestParams';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '@app/shared/dialog/dialog.service';
import { AppointmentFormComponent } from '../components/appointment-form/appointment-form.component';

@Component({
  selector: 'app-manage-appointments',
  standalone: true,
  imports: [
    CapitalizeSpaceBetweenPipe,
    DatePipe,
    LastPropertyPipe,
    MatButton,
    MatCell,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatIconButton,
    PaginatorComponent,
    MatRowDef,
    MatRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatIcon,
  ],
  templateUrl: './manage-appointments.component.html',
  styleUrl: './manage-appointments.component.scss',
})
export class ManageAppointmentsComponent implements OnInit, AfterViewInit {
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
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.doctorId = params['id'];
    });
    this.getPagedAppointments(this.requestParams);
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  getPagedAppointments(params: AppointmentPageRequestParams) {
    if (!this.doctorId) {
      return;
    }
    console.log('doctorId: ', this.doctorId);
    this.appointmentService
      .getPagedDoctorAppointments(params, this.doctorId)
      .subscribe(
        (requestResponseData: PageRequestResponseData<Appointment>) => {
          if (
            !requestResponseData ||
            !requestResponseData.content ||
            requestResponseData.content.length === 0
          ) {
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
              'id',
              'status',
              'patient.email',
              'doctor.email',
              'examination.name',
              'examination.price',
              'examination.duration',
            ],
            {
              'patient.email': 'Patient',
              'doctor.email': 'Doctor',
              'examination.name': 'Examination',
              'examination.price': 'Price',
              'examination.duration': 'Duration',
            },
          );
          this.tableHelper.setAllColumnNames(['edit']);
        },
      );
  }

  openEditAppointmentDialog(appointment: Appointment) {
    this.dialogService
      .openDialog<Appointment, AppointmentFormComponent>(
        AppointmentFormComponent,
        appointment,
        {
          width: '700px',
          height: '700px',
        },
      )
      .subscribe(result => {
        if (result) {
          this.getPagedAppointments(this.requestParams);
        }
      });
  }
}
