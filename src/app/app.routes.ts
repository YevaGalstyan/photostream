import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/photos-page/photos-page').then((m) => m.PhotosPage),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favourites-page/favorites-page').then((m) => m.FavoritesPage),
  },
  {
    path: 'photos/:id',
    loadComponent: () =>
      import('./features/photo-detail-page/photo-detail-page').then((m) => m.PhotoDetailPage),
  },
];
