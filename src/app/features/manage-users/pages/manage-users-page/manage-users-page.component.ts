import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-manage-users-page',
  standalone: true,
  imports: [],
  templateUrl: './manage-users-page.component.html',
  styleUrl: './manage-users-page.component.scss',
})
export class ManageUsersPageComponent implements OnInit {
  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.userService.getPagedUsers().subscribe(users => {
      console.log(users);
    });
  }
}
