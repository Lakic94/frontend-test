import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlanetsComponent } from './planets/planets.component';
import { PlanetDetailComponent } from './planets/planet-detail/planet-detail.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { PlanetGridViewComponent } from './planets/planet-grid-view/planet-grid-view.component';
import { PlanetCardComponent } from './planets/planet-grid-view/planet-card/planet-card.component';
import { provideHttpClient } from '@angular/common/http';
import { PlanetTableViewComponent } from './planets/planet-table-view/planet-table-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    declarations: [AppComponent, PlanetsComponent, PlanetDetailComponent, ConfirmationDialogComponent, PlanetGridViewComponent, PlanetCardComponent],
    imports: [BrowserModule, AppRoutingModule, PlanetTableViewComponent, BrowserAnimationsModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatFormFieldModule],
    providers: [
        provideHttpClient(),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
