import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Planet } from '../../model/planet.interface';
import { CommonModule } from '@angular/common';

export interface PlanetFormDialogData {
    planet?: Planet;
    mode: 'create' | 'edit';
}

@Component({
    selector: 'app-planet-form-dialog',
    templateUrl: './planet-form-dialog.component.html',
    styleUrl: './planet-form-dialog.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
})
export class PlanetFormDialogComponent implements OnInit {
    planetForm: FormGroup;
    isEditMode: boolean;
    selectedFile: File | null = null;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<PlanetFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PlanetFormDialogData
    ) {
        this.isEditMode = data.mode === 'edit';
        this.planetForm = this.createForm();
    }

    ngOnInit() {
        if (this.isEditMode && this.data.planet) {
            this.populateForm(this.data.planet);
        }
    }

    private createForm(): FormGroup {
        return this.fb.group({
            planetName: ['', [Validators.required, Validators.minLength(2)]],
            planetColor: ['', [Validators.required]],
            planetRadiusKM: ['', [Validators.required, Validators.min(1)]],
            distFromSun: ['', [Validators.required, Validators.min(0)]],
            distFromEarth: ['', [Validators.required, Validators.min(0)]],
            description: ['', [Validators.required, Validators.minLength(10)]],
            imageUrl: [''],
        });
    }

    private populateForm(planet: Planet) {
        this.planetForm.patchValue({
            planetName: planet.planetName,
            planetColor: planet.planetColor,
            planetRadiusKM: planet.planetRadiusKM,
            distFromSun: planet.distInMillionsKM.fromSun,
            distFromEarth: planet.distInMillionsKM.fromEarth,
            description: planet.description,
            imageUrl: planet.imageUrl,
        });
    }

    onSubmit() {
        if (this.isFormValid()) {
            const formValue = this.planetForm.value;

            const planetData: Omit<Planet, 'id' | 'imageName'> = {
                planetName: formValue.planetName,
                planetColor: formValue.planetColor,
                planetRadiusKM: Number(formValue.planetRadiusKM),
                distInMillionsKM: {
                    fromSun: Number(formValue.distFromSun),
                    fromEarth: Number(formValue.distFromEarth),
                },
                description: formValue.description,
                imageUrl: formValue.imageUrl,
            };

            this.dialogRef.close({
                action: 'confirm',
                data: planetData,
                file: this.selectedFile,
                mode: this.data.mode,
                planetId: this.data.planet?.id,
            });
        }
    }

    onCancel() {
        this.dialogRef.close({ action: 'cancel' });
    }

    get title(): string {
        return this.isEditMode ? 'Edit Planet' : 'New Planet';
    }

    get submitButtonText(): string {
        return this.isEditMode ? 'Confirm' : 'Create';
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.selectedFile = input.files[0];
            this.planetForm.patchValue({ imageUrl: '' });
        }
    }

    onImageUrlChange(): void {
        const imageUrl = this.planetForm.get('imageUrl')?.value;
        if (imageUrl) {
            this.selectedFile = null;
        }
    }

    isFormValid(): boolean {
        const formValid = this.planetForm.valid;
        const hasImage =
            this.selectedFile !== null ||
            this.planetForm.get('imageUrl')?.value;
        return formValid && !!hasImage;
    }
}
