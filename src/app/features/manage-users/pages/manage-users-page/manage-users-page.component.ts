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
import { UserPageRequestParams } from '../../../../shared/models/UserPageRequestParams';
import { DatePipe } from '../../../../shared/pipes/date.pipe';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditUserComponent } from '../../components/edit-user/edit-user.component';
import { AddUserComponent } from '../../components/add-user/add-user.component';
import { MatCheckbox } from '@angular/material/checkbox';

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
        // { "id": "6604a4a884cfb6230d0ee0d5", "name": "Doctoraaaasd", "surname": "Doctor", "email": "doctor@doctor.com", "role": "ROLE_DOCTOR", "phoneNumber": "123456789", "pesel": "12345678901", "address": { "country": "Poland", "city": "West Samuelland", "street": "Tayna Springs", "postalCode": "62495", "houseNumber": "39", "apartmentNumber": "96" }, "doctorDetails": { "specialization": "Gastroenterologistaaa", "education": "Marblewald College", "description": "Officiis eos quia. Dolore qui saepe fugit est et. Mollitia harum earum corporis totam. Aliquam et esse rerum necessitatibus ex.", "schedule": null }, "isEnabled": true, "createdAt": null, "updatedAt": "2024-05-05T20:05:10.391", "lastLogin": "2024-05-15T12:25:31.192" }
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
}
