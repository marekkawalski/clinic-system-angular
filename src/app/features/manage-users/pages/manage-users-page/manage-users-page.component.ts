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
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { AuthService } from '../../../../core/authentication/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditUserComponent } from '../../components/edit-user/edit-user.component';

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
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './manage-users-page.component.html',
  styleUrl: './manage-users-page.component.scss',
})
export class ManageUsersPageComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  pageUserResponseData?: PageRequestResponseData<User>;
  tableHelper = new TableHelper();
  requestParams: UserPageRequestParams = {};

  constructor(
    private readonly userService: UserService,
    private readonly toast: SnackbarService,
    private readonly authService: AuthService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getPagedUsers(this.requestParams);
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  getPagedUsers(params: UserPageRequestParams) {
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
        this.tableHelper.setBaseColumnNames(this.pageUserResponseData, [
          'description',
        ]);
        this.tableHelper.setAllColumnNames(['edit']);
      });
  }

  openEditUserDialog(user: User) {
    const dialogRef: MatDialogRef<EditUserComponent> = this.dialog.open(
      EditUserComponent,
      {
        width: '1400px',
        height: '800px',
        data: {
          user: user,
        },
      },
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPagedUsers(this.requestParams);
      }
    });
  }
}
