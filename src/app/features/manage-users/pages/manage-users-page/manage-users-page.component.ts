import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
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
import { MatPaginator } from '@angular/material/paginator';
import { NgForOf, NgIf } from '@angular/common';
import { PageRequestResponseData } from '../../../../shared/models/PageRequestResponseData';
import { User } from '../../../../core/models/user/User';
import { CapitalizeSpaceBetweenPipe } from '../../../../shared/pipes/capitalize-space-between.pipe';
import { TableHelper } from '../../../../shared/helpers/tableHelper';
import { LastPropertyPipe } from '../../../../shared/pipes/last-property.pipe';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { UserPageRequestParams } from '../../../../core/models/UserPageRequestParams';
import { DatePipe } from '../../../../shared/pipes/date.pipe';

@Component({
  selector: 'app-manage-users-page',
  standalone: true,
  imports: [
    MatPaginator,
    MatTable,
    MatHeaderCellDef,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatRowDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatCell,
    MatRow,
    NgForOf,
    NgIf,
    CapitalizeSpaceBetweenPipe,
    LastPropertyPipe,
    PaginatorComponent,
    DatePipe,
  ],
  templateUrl: './manage-users-page.component.html',
  styleUrl: './manage-users-page.component.scss',
})
export class ManageUsersPageComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  pageUserResponseData?: PageRequestResponseData<User>;
  tableHelper = new TableHelper();
  requestParams: UserPageRequestParams = {};

  constructor(
    private readonly userService: UserService,
    private readonly toast: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.getPagedUsers(this.requestParams);
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  getPagedUsers(params: UserPageRequestParams) {
    console.log('params', JSON.stringify(params));
    this.userService
      .getPagedUsers(params)
      .subscribe((requestResponseData: PageRequestResponseData<User>) => {
        if (!requestResponseData) {
          this.toast.openFailureSnackBar({
            message: 'Failed to load user data',
          });
          return;
        }
        this.dataSource = new MatTableDataSource(requestResponseData.content);
        this.pageUserResponseData = requestResponseData;

        // Specify the keys you want to exclude
        const excludeColumns: string[] = ['description'];

        this.displayedColumns = this.tableHelper.getFlatKeys(
          requestResponseData.content[0],
          excludeColumns,
        );
      });
  }
}
