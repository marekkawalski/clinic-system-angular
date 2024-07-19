import { Component } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { PathConstants } from '@app/core/constants/path.constants';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MatButton, RouterLink, MatAnchor],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  protected readonly PathConstants = PathConstants;
}
