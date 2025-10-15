import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Planet } from '../model/planet.interface';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:3001/api';

@Injectable({
    providedIn: 'root',
})
export class PlanetApiService {
    constructor(private http: HttpClient) {}

    getPlanets(): Observable<Planet[]> {
        return this.http.get<Planet[]>(`${BASE_URL}/planets`);
    }

    getPlanet(id: number): Observable<Planet> {
        return this.http.get<Planet>(`${BASE_URL}/planets/${id}`);
    }

    createPlanet(
        planetData: Omit<Planet, 'id'>,
        file?: File
    ): Observable<Planet> {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('planetName', planetData.planetName);
            formData.append('planetColor', planetData.planetColor);
            formData.append(
                'planetRadiusKM',
                planetData.planetRadiusKM.toString()
            );
            formData.append(
                'distInMillionsKM[fromSun]',
                planetData.distInMillionsKM.fromSun.toString()
            );
            formData.append(
                'distInMillionsKM[fromEarth]',
                planetData.distInMillionsKM.fromEarth.toString()
            );
            formData.append('description', planetData.description);

            return this.http.post<Planet>(`${BASE_URL}/planets`, formData);
        } else {
            return this.http.post<Planet>(`${BASE_URL}/planets`, planetData);
        }
    }

    updatePlanet(
        id: number,
        planetData: Partial<Planet>,
        file?: File
    ): Observable<Planet> {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            if (planetData.planetName)
                formData.append('planetName', planetData.planetName);
            if (planetData.planetColor)
                formData.append('planetColor', planetData.planetColor);
            if (planetData.planetRadiusKM)
                formData.append(
                    'planetRadiusKM',
                    planetData.planetRadiusKM.toString()
                );
            if (planetData.distInMillionsKM?.fromSun)
                formData.append(
                    'distInMillionsKM[fromSun]',
                    planetData.distInMillionsKM.fromSun.toString()
                );
            if (planetData.distInMillionsKM?.fromEarth)
                formData.append(
                    'distInMillionsKM[fromEarth]',
                    planetData.distInMillionsKM.fromEarth.toString()
                );
            if (planetData.description)
                formData.append('description', planetData.description);

            return this.http.put<Planet>(`${BASE_URL}/planets/${id}`, formData);
        } else {
            return this.http.put<Planet>(
                `${BASE_URL}/planets/${id}`,
                planetData
            );
        }
    }

    deletePlanet(id: number): Observable<Planet> {
        return this.http.delete<Planet>(`${BASE_URL}/planets/${id}`);
    }
}
