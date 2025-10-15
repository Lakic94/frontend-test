import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanetApiService } from '../services/planet-api.service';
import { PlanetStateService } from '../services/planet-state.service';
import { Planet } from '../model/planet.interface';

@Component({
    selector: 'app-planet-detail',
    templateUrl: './planet-detail.component.html',
    styleUrl: './planet-detail.component.scss',
})
export class PlanetDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private planetApiService = inject(PlanetApiService);
    private planetStateService = inject(PlanetStateService);
    planet = signal<Planet | null>(null);

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id && !isNaN(+id)) {
            this.planetApiService.getPlanet(+id).subscribe((planet) => {
                this.planet.set(planet);
            });
        } else {
            this.router.navigate(['/planets']);
        }
    }

    onEditPlanet() {
        const currentPlanet = this.planet();
        if (currentPlanet) {
            this.planetStateService.openEditPlanetDialog(currentPlanet);
        }
    }

    onDeletePlanet() {
        const currentPlanet = this.planet();
        if (currentPlanet) {
            this.planetStateService.openDeletePlanetDialog(currentPlanet);
        }
    }
}
