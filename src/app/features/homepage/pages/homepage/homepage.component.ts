import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { FeaturesComponent } from '../../components/features/features.component';
import { FooterComponent } from '@app/shared/components/footer/footer.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [HeroComponent, FeaturesComponent, FooterComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {}
