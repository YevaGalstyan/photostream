import { Component, input, output } from '@angular/core';
import { Photo } from '../../../core/models/photo.model';
import { PhotoCard } from '../photo-card/photo-card';

@Component({
    selector: 'app-photo-grid',
    imports: [PhotoCard],
    templateUrl: './photo-grid.html',
    styleUrl: './photo-grid.scss',
})
export class PhotoGrid {
    readonly photos = input.required<Photo[]>();
    readonly favoriteIds = input<ReadonlySet<number>>(new Set());

    readonly photoClick = output<Photo>();
    readonly favoriteToggle = output<Photo>();
    readonly tagClick = output<string>();
}