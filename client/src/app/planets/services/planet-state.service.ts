import { computed, Injectable, signal } from '@angular/core';
import { Planet } from '../model/planet.interface';
import { PlanetApiService } from './planet-api.service';
import { MatDialog } from '@angular/material/dialog';
import {
    PlanetFormDialogComponent,
    PlanetFormDialogData,
} from '../shared/planet-form-dialog/planet-form-dialog.component';
import { mergeMap, filter, tap, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../shared/model/confirmation-dialog';

@Injectable({
    providedIn: 'root',
})
export class PlanetStateService {
    private _planets = signal<Planet[]>([]);
    private _searchTerm = signal<string>('');
    private _viewMode = signal<'grid' | 'table'>('table');

    private _sortField = signal<string>('');
    private _sortDirection = signal<string>('asc');

    constructor(
        private planetApiService: PlanetApiService,
        private dialog: MatDialog,
        private router: Router
    ) {}

    loadPlanets() {
        this.planetApiService.getPlanets().subscribe((planets: Planet[]) => {
            this._planets.set(planets);
        });
    }

    readonly filteredPlanets = computed(() => {
        const planets = this._planets();
        const searchTerm = this._searchTerm();

        let filtered = planets;
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            filtered = planets.filter(
                (planet) =>
                    planet.planetName.toLowerCase().includes(search) ||
                    planet.planetColor.toLowerCase().includes(search) ||
                    planet.description.toLowerCase().includes(search)
            );
        }
        return filtered;
    });

    readonly tableViewPlanets = computed(() => {
        const filtered = this.filteredPlanets();
        const sortField = this._sortField();
        const sortDirection = this._sortDirection();

        return [...filtered].sort((a, b) => {
            const getNestedValue = (obj: any, path: string) => {
                return path
                    .split('.')
                    .reduce((current, key) => current?.[key], obj);
            };

            const aVal = getNestedValue(a, sortField);
            const bVal = getNestedValue(b, sortField);

            let comparison = 0;
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                comparison = aVal.localeCompare(bVal);
            } else if (typeof aVal === 'number' && typeof bVal === 'number') {
                comparison = aVal - bVal;
            } else {
                comparison = String(aVal).localeCompare(String(bVal));
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });
    });

    readonly gridViewPlanets = computed(() => {
        return this.filteredPlanets();
    });

    readonly filteredAndSortedPlanets = computed(() => {
        return this._viewMode() === 'table'
            ? this.tableViewPlanets()
            : this.filteredPlanets();
    });

    readonly planets = this._planets.asReadonly();
    readonly searchTerm = this._searchTerm.asReadonly();
    readonly sortField = this._sortField.asReadonly();
    readonly sortDirection = this._sortDirection.asReadonly();
    readonly viewMode = this._viewMode.asReadonly();

    setSearchTerm(term: string) {
        this._searchTerm.set(term);
    }

    setSortField(field: string) {
        this._sortField.set(field);
    }

    setSortDirection(direction: string) {
        this._sortDirection.set(direction);
    }

    setViewMode(mode: 'grid' | 'table') {
        this._viewMode.set(mode);
    }

    openCreatePlanetDialog() {
        const dialogRef = this.dialog.open(PlanetFormDialogComponent, {
            width: '600px',
            data: { mode: 'create' } as PlanetFormDialogData,
        });

        dialogRef
            .afterClosed()
            .pipe(
                filter((result) => result?.action === 'confirm'),
                mergeMap((result) =>
                    this.planetApiService.createPlanet(result.data, result.file)
                ),
                tap(() => {
                    this.loadPlanets();
                })
            )
            .subscribe({
                error: (error) => {
                    console.error('Error creating planet:', error);
                },
            });
    }

    openEditPlanetDialog(planet: Planet): void {
        const confirmationData: ConfirmationDialogData = {
            title: 'Confirm edit',
            message: `Are you sure you want to edit <strong>${planet.planetName}</strong>?`,
        };

        this.dialog
            .open(PlanetFormDialogComponent, {
                width: '600px',
                data: { mode: 'edit', planet } as PlanetFormDialogData,
            })
            .afterClosed()
            .pipe(
                filter((formResult) => formResult?.action === 'confirm'),
                mergeMap((formResult) => {
                    return this.dialog
                        .open(ConfirmationDialogComponent, {
                            width: '500px',
                            data: confirmationData,
                        })
                        .afterClosed()
                        .pipe(
                            map((confirmResult) => ({
                                formResult,
                                confirmResult,
                            }))
                        );
                }),
                filter(({ confirmResult }) => confirmResult === true),
                mergeMap(({ formResult }) => {
                    return this.planetApiService.updatePlanet(
                        formResult.planetId,
                        formResult.data,
                        formResult.file
                    );
                }),
                tap(() => {
                    this.loadPlanets();
                    this.router.navigate(['/planets']);
                })
            )
            .subscribe({
                error: (error) => {
                    console.error('Error updating planet:', error);
                },
            });
    }

    openDeletePlanetDialog(planet: Planet): void {
        const data: ConfirmationDialogData = {
            title: 'Confirm delete',
            message: `Are you sure you want to delete <strong>${planet.planetName}</strong>?`,
        };

        this.dialog
            .open(ConfirmationDialogComponent, {
                width: '500px',
                data: data,
            })
            .afterClosed()
            .pipe(
                filter((result) => result === true),
                mergeMap(() => this.planetApiService.deletePlanet(planet.id)),
                tap(() => {
                    this.loadPlanets();
                    this.router.navigate(['/planets']);
                })
            )
            .subscribe({
                error: (error) => {
                    console.error('Error deleting planet:', error);
                },
            });
    }
}
