import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanetsComponent } from './planets/planets.component';
import { PlanetDetailComponent } from './planets/planet-detail/planet-detail.component';

const routes: Routes = [
    { path: '', component: PlanetsComponent, pathMatch: 'full' },
    { path: 'planets/:id', component: PlanetDetailComponent },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
