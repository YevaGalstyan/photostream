import { Component, computed, effect, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FavoritesService } from '../../core/services/favorites.service';
import { Photo } from '../../core/models/photo.model';

@Component({
  selector: 'app-photo-detail-page',
  imports: [MatButton, MatIcon],
  templateUrl: './photo-detail-page.html',
  styleUrl: './photo-detail-page.scss',
})
export class PhotoDetailPage {
  private readonly favorites = inject(FavoritesService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();
  protected readonly photo = computed(() => this.favorites.get(Number(this.id())));

  constructor() {
    effect(() => {
      if (!this.photo()) this.router.navigateByUrl('/favorites');
    });
  }

  protected remove(photo: Photo): void {
    this.favorites.remove(photo.id);
  }

    protected close(): void {
    this.router.navigateByUrl('/favorites');
  }
}