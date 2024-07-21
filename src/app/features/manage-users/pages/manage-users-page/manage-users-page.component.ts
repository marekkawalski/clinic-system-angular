import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '@app/core/services/user.service';
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

import { PageRequestResponseData } from '@app/shared/models/PageRequestResponseData';
import { User } from '@app/core/models/user/User';
import { CapitalizeSpaceBetweenPipe } from '@app/shared/pipes/capitalize-space-between.pipe';
import { TableHelper } from '@app/shared/helpers/tableHelper';
import { LastPropertyPipe } from '@app/shared/pipes/last-property.pipe';
import { PaginatorComponent } from '@app/shared/components/paginator/paginator.component';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { UserPageRequestParams } from '@app/shared/models/UserPageRequestParams';
import { DatePipe } from '@app/shared/pipes/date.pipe';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditUserComponent } from '../../components/edit-user/edit-user.component';
import { AddUserComponent } from '../../components/add-user/add-user.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { SpinnerService } from '@app/shared/spinner/spinner.service';

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
    CapitalizeSpaceBetweenPipe,
    LastPropertyPipe,
    PaginatorComponent,
    DatePipe,
    MatIcon,
    MatIconButton,
    MatButton,
    MatCheckbox,
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
  showDisabled?: boolean = false;

  constructor(
    private readonly userService: UserService,
    private readonly toast: SnackbarService,
    private readonly dialog: MatDialog,
    private readonly spinnerService: SpinnerService,
    private readonly snackBarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    const showDisabled = localStorage.getItem('show-disabled');
    if (showDisabled) {
      this.showDisabled = showDisabled === 'true';
    }
    this.requestParams['show-disabled'] = this.showDisabled;

    this.getPagedUsers(this.requestParams);
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  getPagedUsers(params: UserPageRequestParams) {
    this.spinnerService.show();
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
        this.tableHelper.setSpecifiedBaseColumnNamesFromRequestData(
          this.pageUserResponseData,
          [
            'id',
            'name',
            'surname',
            'email',
            'role',
            'phoneNumber',
            'pesel',
            'address.country',
            'address.city',
            'address.street',
            'address.postalCode',
            'address.houseNumber',
            'address.apartmentNumber',
            'isEnabled',
            'createdAt',
            'updatedAt',
            'lastLogin',
          ],
          {
            id: 'Id',
            name: 'Name',
            surname: 'Surname',
            email: 'Email',
            role: 'Role',
            phoneNumber: 'Phone Number',
            pesel: 'Pesel',
            'address.country': 'Country',
            'address.city': 'City',
            'address.street': 'Street',
            'address.postalCode': 'Postal Code',
            'address.houseNumber': 'House Number',
            'address.apartmentNumber': 'Apartment Number',
            isEnabled: 'Is Enabled',
            createdAt: 'Created At',
            updatedAt: 'Updated At',
            lastLogin: 'Last Login',
          },
        );
        this.tableHelper.setAllColumnNames(['edit', 'delete']);
        this.spinnerService.hide();
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

  openAddUserDialog() {
    const dialogRef: MatDialogRef<AddUserComponent> = this.dialog.open(
      AddUserComponent,
      {
        width: '1400px',
        height: '800px',
      },
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPagedUsers(this.requestParams);
      }
    });
  }

  toggleDisabled() {
    this.showDisabled = !this.showDisabled;
    localStorage.setItem('show-disabled', String(this.showDisabled));
    this.requestParams['show-disabled'] = this.showDisabled;
    this.getPagedUsers(this.requestParams);
  }

  deleteUser(user: User) {
    this.spinnerService.show();
    this.userService.deleteUser(user.id).subscribe(() => {
      this.snackBarService.openSuccessSnackBar({
        message: `User ${user.name} ${user.surname} has been deleted`,
      });
      this.getPagedUsers(this.requestParams);
      this.spinnerService.hide();
    });
  }
}
