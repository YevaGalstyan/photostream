import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Photo } from '../models/photo.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'photostream.favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly storage = inject(StorageService);
  private readonly state = signal<Photo[]>(this.storage.get<Photo[]>(STORAGE_KEY, []));

  readonly favorites = this.state.asReadonly();
  readonly ids = computed(() => new Set(this.state().map((p) => p.id)));

  constructor() {
    effect(() => this.storage.set(STORAGE_KEY, this.state()));
  }

  isFavorite(id: number): boolean {
    return this.ids().has(id);
  }

  get(id: number): Photo | undefined {
    return this.state().find((p) => p.id === id);
  }

  add(photo: Photo): void {
    if (!this.isFavorite(photo.id)) this.state.update((list) => [...list, photo]);
  }

  remove(id: number): void {
    this.state.update((list) => list.filter((p) => p.id !== id));
  }

  toggle(photo: Photo): void {
    this.isFavorite(photo.id) ? this.remove(photo.id) : this.add(photo);
  }
}
