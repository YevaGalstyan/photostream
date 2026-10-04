import { Component, computed, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Photo } from '../../core/models/photo.model';
import { FavoritesService } from '../../core/services/favorites.service';
import { SearchService } from '../../core/services/search.service';
import { matchesCriteria } from '../../core/utils/photo-search';
import { PhotoGrid } from '../../shared/components/photo-grid/photo-grid';
import { SearchBar } from '../../shared/components/search-bar/search-bar';

@Component({
    selector: 'app-favorites-page',
    imports: [SearchBar, PhotoGrid, MatButton, MatIcon, RouterLink],
    templateUrl: './favorites-page.html',
    styleUrl: './favorites-page.scss',
})
export class FavoritesPage {
    private readonly router = inject(Router);
    protected readonly favorites = inject(FavoritesService);
    protected readonly search = inject(SearchService);

    protected readonly visible = computed(() =>
        this.favorites.favorites().filter((p) => matchesCriteria(p, this.search.criteria())),
    );

    protected open(photo: Photo): void {
        this.router.navigate(['/photos', photo.id]);
    }
}