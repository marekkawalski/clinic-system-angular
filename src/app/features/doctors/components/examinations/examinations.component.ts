import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CapitalizeSpaceBetweenPipe } from '@app/shared/pipes/capitalize-space-between.pipe';
import { DatePipe } from '@app/shared/pipes/date.pipe';
import { LastPropertyPipe } from '@app/shared/pipes/last-property.pipe';
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
import { ExaminationPageRequestParams } from '@app/shared/models/ExaminationPageRequestParams';
import { PageRequestResponseData } from '@app/shared/models/PageRequestResponseData';
import { Examination } from '@app/core/models/Examination';
import { TableHelper } from '@app/shared/helpers/tableHelper';
import { ExaminationService } from '../../services/examination.service';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { MatPaginator } from '@angular/material/paginator';
import { Doctor } from '@app/core/models/Doctor';

@Component({
  selector: 'app-examinations',
  standalone: true,
  imports: [
    CapitalizeSpaceBetweenPipe,
    DatePipe,
    LastPropertyPipe,
    MatCell,
    MatCellDef,
    MatHeaderRowDef,
    PaginatorComponent,
    MatRowDef,
    MatRow,
    MatHeaderRow,
    MatHeaderCell,
    MatHeaderCellDef,
    MatColumnDef,
    MatTable,
  ],
  templateUrl: './examinations.component.html',
  styleUrl: './examinations.component.scss',
})
export class ExaminationsComponent implements OnInit, AfterViewInit {
  @Input() doctor?: Doctor;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  examinationTableHelper = new TableHelper();
  pageExaminationResponseData?: PageRequestResponseData<Examination>;
  examinationDataSource: MatTableDataSource<any> =
    new MatTableDataSource<Examination>();
  examinationRequestParams: ExaminationPageRequestParams = {};

  constructor(
    protected readonly examinationService: ExaminationService,
    private readonly toast: SnackbarService,
  ) {}

  ngOnInit(): void {
    if (!this.doctor) return;
    this.examinationRequestParams['doctor-ids'] = [this.doctor.id];
    this.loadDoctorExaminations(this.examinationRequestParams);
  }

  ngAfterViewInit() {
    if (this.paginator) this.examinationDataSource.paginator = this.paginator;
  }

  protected loadDoctorExaminations(params: ExaminationPageRequestParams) {
    if (!this.doctor) return;
    this.examinationService
      .getPagedDoctorExaminations(params)
      .subscribe(
        (requestResponseData: PageRequestResponseData<Examination>) => {
          if (!requestResponseData) {
            this.toast.openFailureSnackBar({
              message: 'Failed to load examination data',
            });
            return;
          }
          this.pageExaminationResponseData = requestResponseData;
          this.examinationDataSource = new MatTableDataSource<Examination>(
            requestResponseData.content,
          );
          this.examinationTableHelper.setSpecifiedBaseColumnNamesFromRequestData(
            this.pageExaminationResponseData,
            ['name', 'duration', 'price', 'status'],
            {
              name: 'Name',
              duration: 'Duration',
              price: 'Price',
              status: 'Status',
            },
          );
        },
      );
  }
}
