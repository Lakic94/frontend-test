import { Component, inject, Input } from '@angular/core';
import { Planet } from '../../model/planet.interface';
import { Router } from '@angular/router';

@Component({
    selector: 'app-planet-card',
    templateUrl: './planet-card.component.html',
    styleUrl: './planet-card.component.scss',
})
export class PlanetCardComponent {
    @Input() planet: Planet = {} as Planet;
    private router = inject(Router);

    onCardClick() {
        this.router.navigate(['/planets', this.planet.id]);
    }
}
