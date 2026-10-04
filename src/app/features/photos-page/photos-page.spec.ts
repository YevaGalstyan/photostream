import { TestBed } from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';
import { Photo } from '../../core/models/photo.model';
import { FavoritesService } from '../../core/services/favorites.service';
import { PhotoService, DEFAULT_PAGE_SIZE } from '../../core/services/photo.service';
import { SearchService } from '../../core/services/search.service';
import { StorageService } from '../../core/services/storage.service';
import { PhotosPage } from './photos-page';

class PhotoServiceStub {
  readonly requests: number[] = [];
  readonly responses = new Subject<Photo[]>();

  getPhotos(page: number): Observable<Photo[]> {
    this.requests.push(page);
    return this.responses.asObservable();
  }
}

describe('PhotosPage', () => {
  const photo: Photo = {
    id: 1,
    title: 'Test photo',
    tags: ['nature'],
    url: 'photo-url',
    fullUrl: 'full-photo-url',
  };
  const originalIntersectionObserver = globalThis.IntersectionObserver;

  beforeEach(() => {
    globalThis.IntersectionObserver = class {
      observe(): void {}
      disconnect(): void {}
    } as unknown as typeof IntersectionObserver;
    localStorage.clear();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  it('loads a batch and prevents another request while loading', () => {
    const photoService = new PhotoServiceStub();
    TestBed.configureTestingModule({
      imports: [PhotosPage],
      providers: [
        { provide: PhotoService, useValue: photoService },
        FavoritesService,
        SearchService,
        StorageService,
      ],
    });
    const fixture = TestBed.createComponent(PhotosPage);
    const page = fixture.componentInstance as unknown as {
      loadMore: () => void;
      photos: () => Photo[];
    };
    fixture.detectChanges();

    page.loadMore();
    page.loadMore();

    expect(photoService.requests).toEqual([1]);

    photoService.responses.next([photo]);

    expect(page.photos()).toEqual([photo]);
    expect(photoService.requests.length).toBe(1);
    expect(DEFAULT_PAGE_SIZE).toBeGreaterThan(0);
  });
});