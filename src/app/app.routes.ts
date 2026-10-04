import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
            import('./features/photos/photos-page/photos-page').then((m) => m.PhotosPage),
    },
];
