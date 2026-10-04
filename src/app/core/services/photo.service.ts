import { Injectable } from "@angular/core";
import { Photo } from "../models/photo.model";
import { delay, Observable, of } from "rxjs";
import { generateTitle } from "../utils/fake-name-generator";
import { generateTags } from "../utils/tag-generator";
import { hasCriteria, matchesCriteria, NO_CRITERIA, SearchCriteria } from "../utils/photo-search";

export const DEFAULT_PAGE_SIZE = 20;
const MIN_DELAY_MS = 200;
const MAX_DELAY_MS = 300;
export const SEARCH_CATALOGUE_SIZE = 500;

export function matchesQuery(photo: Photo, query: string): boolean {
    console.log(query);
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const title = photo.title.toLowerCase();
    return terms.every(
        (term) => title.includes(term) || photo.tags.some((tag) => tag.includes(term)),
    );
}

@Injectable({ providedIn: 'root' })
export class PhotoService {
    private catalogue?: Photo[];

    private randomDelay(): number {
        return MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
    }

    getPhotos(page: number, pageSize = DEFAULT_PAGE_SIZE, criteria: SearchCriteria = NO_CRITERIA): Observable<Photo[]> {
        const photos = hasCriteria(criteria)
            ? this.searchPage(criteria, page, pageSize)
            : this.streamPage(page, pageSize);
        return of(photos).pipe(delay(this.randomDelay()));
    }

    private searchPage(criteria: SearchCriteria, page: number, size: number): Photo[] {
        const matches = this.getCatalogue().filter((p) => matchesCriteria(p, criteria));
        return matches.slice((page - 1) * size, page * size);
    }

    private streamPage(page: number, size: number): Photo[] {
        const start = (page - 1) * size + 1;
        return Array.from({ length: size }, (_, i) => this.createPhoto(start + i));
    }

    private getCatalogue(): Photo[] {
        return (this.catalogue ??= Array.from({ length: SEARCH_CATALOGUE_SIZE }, (_, i) =>
            this.createPhoto(i + 1),
        ));
    }

    private createPhoto(id: number): Photo {
        return {
            id,
            title: generateTitle(id),
            tags: generateTags(id),
            url: `https://picsum.photos/seed/${id}/200/300`,
            fullUrl: `https://picsum.photos/seed/${id}/1200/1800`,
        };
    }
}