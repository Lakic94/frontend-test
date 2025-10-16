import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { PlanetStateService } from '../services/planet-state.service';
import { Planet } from '../model/planet.interface';
import { Router } from '@angular/router';

@Component({
    selector: 'app-planet-table-view',
    templateUrl: './planet-table-view.component.html',
    styleUrl: './planet-table-view.component.scss',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
    ],
    standalone: true,
})
export class PlanetTableViewComponent {
    private planetStateService = inject(PlanetStateService);
    planets = this.planetStateService.tableViewPlanets;
    displayedColumns: string[] = [
        'planetName',
        'planetColor',
        'planetRadiusKM',
        'distInMillionsKM.fromSun',
        'distInMillionsKM.fromEarth',
    ];
    dataSource: MatTableDataSource<Planet> = new MatTableDataSource<Planet>();
    private router = inject(Router);

    @Output() sortChange = new EventEmitter<Sort>();

    onRowClick(row: Planet) {
        this.router.navigate(['/planets', row.id]);
    }
}
