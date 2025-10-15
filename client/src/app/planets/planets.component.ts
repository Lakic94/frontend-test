import { Component, inject, OnInit } from '@angular/core';
import { PlanetStateService } from './services/planet-state.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'app-planets',
    templateUrl: './planets.component.html',
    styleUrl: './planets.component.scss',
})
export class PlanetsComponent implements OnInit {
    planetStateService = inject(PlanetStateService);
    planets = this.planetStateService.filteredAndSortedPlanets;
    searchTerm = this.planetStateService.searchTerm;
    searchTermFormControl: FormControl = new FormControl('');
    gridViewPlanets = this.planetStateService.gridViewPlanets;

    constructor() {
        this.planetStateService.loadPlanets();
    }

    ngOnInit() {
        this.searchTermFormControl.valueChanges
            .pipe(debounceTime(1000))
            .subscribe((value) => {
                this.planetStateService.setSearchTerm(value);
            });
    }

    onSortChange(sort: Sort) {
        this.planetStateService.setSortField(sort.active);
        this.planetStateService.setSortDirection(sort.direction);
    }

    changeViewMode(mode: 'grid' | 'table') {
        this.planetStateService.setViewMode(mode);
        if (mode === 'grid') {
            this.planetStateService.setSortField('');
            this.planetStateService.setSortDirection('');
        }
    }

    onCreatePlanet() {
        this.planetStateService.openCreatePlanetDialog();
    }
}
