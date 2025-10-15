import { Component, inject } from '@angular/core';
import { PlanetStateService } from '../services/planet-state.service';

@Component({
  selector: 'app-planet-grid-view',
  templateUrl: './planet-grid-view.component.html',
  styleUrl: './planet-grid-view.component.scss'
})
export class PlanetGridViewComponent {
  private planetStateService = inject(PlanetStateService);
  planets = this.planetStateService.gridViewPlanets;
}
