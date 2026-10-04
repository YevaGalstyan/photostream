import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { Photo } from '../../core/models/photo.model';
import { FavoritesService } from '../../core/services/favorites.service';
import { StorageService } from '../../core/services/storage.service';
import { PhotoDetailPage } from './photo-detail-page';

describe('PhotoDetailPage', () => {
  const photo: Photo = {
    id: 1,
    title: 'Test photo',
    tags: ['nature', 'sunset'],
    url: 'photo-url',
    fullUrl: 'full-photo-url',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [PhotoDetailPage],
      providers: [provideRouter([]), FavoritesService, StorageService],
    });
  });

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('renders the favorite photo and removes it through the service', () => {
    const favorites = TestBed.inject(FavoritesService);
    favorites.add(photo);
    const fixture = TestBed.createComponent(PhotoDetailPage);
    fixture.componentRef.setInput('id', String(photo.id));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.photo').getAttribute('src')).toBe(photo.fullUrl);
    expect(fixture.nativeElement.querySelector('.title').textContent).toContain(photo.title);

    fixture.nativeElement.querySelector('.bar button').click();

    expect(favorites.isFavorite(photo.id)).toBe(false);
  });
});
