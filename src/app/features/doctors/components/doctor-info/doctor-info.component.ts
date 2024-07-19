import { Component, Input } from '@angular/core';

import { MatIcon } from '@angular/material/icon';
import { Doctor } from '@app/core/models/Doctor';

@Component({
  selector: 'app-doctor-info',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './doctor-info.component.html',
  styleUrl: './doctor-info.component.scss',
})
export class DoctorInfoComponent {
  @Input() doctor?: Doctor;
}
