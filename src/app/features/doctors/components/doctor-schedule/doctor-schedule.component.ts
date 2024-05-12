import { Component, Input, OnInit } from '@angular/core';
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
import { Doctor } from '../../../../core/models/Doctor';
import { TableHelper } from '../../../../shared/helpers/tableHelper';

@Component({
  selector: 'app-doctor-schedule',
  standalone: true,
  imports: [
    MatCell,
    NgForOf,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatTable,
    NgIf,
    MatHeaderCellDef,
    MatCellDef,
  ],
  templateUrl: './doctor-schedule.component.html',
  styleUrl: './doctor-schedule.component.scss',
})
export class DoctorScheduleComponent implements OnInit {
  @Input() doctor?: Doctor;
  scheduleDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  tableHelper = new TableHelper();

  constructor() {}

  ngOnInit(): void {
    if (!this.doctor) return;
    this.loadDoctorSchedules();
  }

  private loadDoctorSchedules() {
    if (this.doctor?.doctorDetails?.schedule?.dailySchedules) {
      this.scheduleDataSource = new MatTableDataSource<any>([
        this.doctor.doctorDetails.schedule.dailySchedules,
      ]);
      this.tableHelper.setBaseColumnNames([
        ...this.doctor.doctorDetails.schedule.dailySchedules.keys(),
      ]);
    }
  }
}
