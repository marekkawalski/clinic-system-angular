import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CapitalizeSpaceBetweenPipe } from '../../../shared/pipes/capitalize-space-between.pipe';
import { DatePipe } from '../../../shared/pipes/date.pipe';
import { LastPropertyPipe } from '../../../shared/pipes/last-property.pipe';
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
import { NgForOf, NgIf } from '@angular/common';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { PageRequestResponseData } from '../../../shared/models/PageRequestResponseData';
import { TableHelper } from '../../../shared/helpers/tableHelper';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from '../../../core/models/appointment/Appointment';
import { PageRequestParams } from '../../../shared/models/PageRequestParams';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { AppointmentPageRequestParams } from '../../../shared/models/AppointmentPageRequestParams';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../shared/components/dialog/dialog.service';
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
    NgIf,
    MatTable,
    MatColumnDef,
    NgForOf,
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
    this.appointmentService
      .getPagedDoctorAppointments(params, this.doctorId)
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
      .openDialog(
        AppointmentFormComponent,
        { appointment },
        {
          title: 'Edit Appointment',
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