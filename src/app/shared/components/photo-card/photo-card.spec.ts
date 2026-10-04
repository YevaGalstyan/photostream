import { TestBed } from '@angular/core/testing';
import { Photo } from '../../../core/models/photo.model';
import { PhotoCard } from './photo-card';

describe('PhotoCard', () => {
  const photo: Photo = {
    id: 1,
    title: 'Test photo',
    tags: ['nature'],
    url: 'photo-url',
    fullUrl: 'full-photo-url',
  };

  it('emits favoriteToggle from the heart and photoClick from the card', () => {
    TestBed.configureTestingModule({ imports: [PhotoCard] });
    const fixture = TestBed.createComponent(PhotoCard);
    const component = fixture.componentInstance;
    const favoriteEvents: Photo[] = [];
    const photoEvents: Photo[] = [];
    component.favoriteToggle.subscribe((event) => favoriteEvents.push(event));
    component.photoClick.subscribe((event) => photoEvents.push(event));
    fixture.componentRef.setInput('photo', photo);
    fixture.componentRef.setInput('favorite', true);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.heart').click();
    expect(favoriteEvents).toEqual([photo]);
    expect(photoEvents).toEqual([]);

    fixture.nativeElement.querySelector('.card').click();
    expect(photoEvents).toEqual([photo]);
  });
});
