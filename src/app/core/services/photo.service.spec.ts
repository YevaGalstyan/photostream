import { firstValueFrom } from 'rxjs';
import {
  DEFAULT_PAGE_SIZE,
  PhotoService,
  SEARCH_CATALOGUE_SIZE,
  matchesQuery,
} from './photo.service';
import { Photo } from '../models/photo.model';
import { generateTitle } from '../utils/fake-name-generator';
import { matchesCriteria } from '../utils/photo-search';
import { generateTags } from '../utils/tag-generator';

describe('Photo generators', () => {
  it('generates the same title for the same id', () => {
    expect(generateTitle(42)).toBe(generateTitle(42));
  });

  it('generates the same tags for the same id', () => {
    expect(generateTags(42)).toEqual(generateTags(42));
  });

  it('generates the requested number of distinct tags', () => {
    const tags = generateTags(42, 5);

    expect(tags.length).toBe(5);
    expect(new Set(tags).size).toBe(5);
  });
});

describe('PhotoService', () => {
  let service: PhotoService;
  const photo: Photo = {
    id: 1,
    title: 'Golden Mountain',
    tags: ['nature', 'sunset', 'travel'],
    url: 'photo-url',
    fullUrl: 'full-photo-url',
  };

  beforeEach(() => {
    service = new PhotoService();
  });

  it('matches a query against the title', () => {
    expect(matchesQuery(photo, 'Golden Mountain')).toBe(true);
  });

  it('matches a query against tags', () => {
    expect(matchesQuery(photo, 'sunset')).toBe(true);
  });

  it('supports partial matches in titles and tags', () => {
    expect(matchesQuery(photo, 'gold')).toBe(true);
    expect(matchesQuery(photo, 'trav')).toBe(true);
  });

  it('requires every term in a multiple-term query to match', () => {
    expect(matchesQuery(photo, 'gold sunset')).toBe(true);
    expect(matchesQuery(photo, 'gold ocean')).toBe(false);
  });

  it('matches every photo for an empty query', () => {
    expect(matchesQuery(photo, '')).toBe(true);
    expect(matchesCriteria(photo, { query: '', tags: [] })).toBe(true);
  });

  it('uses OR logic when matching criteria tags', () => {
    expect(matchesCriteria(photo, { query: '', tags: ['city', 'sunset'] })).toBe(true);
    expect(matchesCriteria(photo, { query: '', tags: ['city', 'ocean'] })).toBe(false);
  });

  it('returns a page of generated photos', async () => {
    const photos = await firstValueFrom(service.getPhotos(2, 3));

    expect(photos.length).toBe(3);
    expect(photos.map((photo) => photo.id)).toEqual([4, 5, 6]);
    expect(photos[0].id).toBe(4);
    expect(typeof photos[0].title).toBe('string');
    expect(photos[0].url).toBe('https://picsum.photos/seed/4/200/300');
    expect(photos[0].fullUrl).toBe('https://picsum.photos/seed/4/1200/1800');
    expect(photos[0].tags.length).toBe(3);
  });

  it('uses the default page size', async () => {
    const photos = await firstValueFrom(service.getPhotos(1));

    expect(photos.length).toBe(DEFAULT_PAGE_SIZE);
    expect(photos[0].id).toBe(1);
    expect(photos.at(-1)?.id).toBe(DEFAULT_PAGE_SIZE);
  });

  it('filters catalogue photos by tag across pages', async () => {
    const photos = await firstValueFrom(
      service.getPhotos(2, DEFAULT_PAGE_SIZE, { query: '', tags: ['nature'] }),
    );

    expect(photos.length).toBeLessThanOrEqual(DEFAULT_PAGE_SIZE);
    expect(photos.every((photo) => photo.tags.includes('nature'))).toBe(true);
  });

  it('filters catalogue photos by query and tags', async () => {
    const firstPage = await firstValueFrom(service.getPhotos(1, 1));
    const target = firstPage[0];
    const queryTerm = target.title.split(' ')[0];
    const tag = target.tags[0];

    const photos = await firstValueFrom(
      service.getPhotos(1, SEARCH_CATALOGUE_SIZE, {
        query: queryTerm,
        tags: [tag],
      }),
    );

    expect(photos.length).toBeGreaterThan(0);
    expect(
      photos.every(
        (photo) =>
          photo.title.toLowerCase().includes(queryTerm.toLowerCase()) ||
          photo.tags.some((photoTag) => photoTag.includes(queryTerm.toLowerCase())),
      ),
    ).toBe(true);
    expect(photos.every((photo) => photo.tags.includes(tag))).toBe(true);
    expect(photos.some((photo) => photo.id === target.id)).toBe(true);
  });

  it('returns an empty page when criteria have no matches', async () => {
    const photos = await firstValueFrom(
      service.getPhotos(1, DEFAULT_PAGE_SIZE, {
        query: 'no-photo-can-have-this-query',
        tags: [],
      }),
    );

    expect(photos).toEqual([]);
  });
});
