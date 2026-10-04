import { Photo } from '../models/photo.model';
import { matchesQuery } from '../services/photo.service';

export interface SearchCriteria {
  query: string;
  tags: string[];
}

export const NO_CRITERIA: SearchCriteria = { query: '', tags: [] };

export function hasCriteria(c: SearchCriteria): boolean {
  return c.query.trim() !== '' || c.tags.length > 0;
}

export function matchesCriteria(photo: Photo, { query, tags }: SearchCriteria): boolean {
  const tagOk = tags.length === 0 || tags.some((t) => photo.tags.includes(t));
  return tagOk && matchesQuery(photo, query);
}
