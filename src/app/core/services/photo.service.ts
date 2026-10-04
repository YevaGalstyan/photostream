import { Injectable } from "@angular/core";
import { Photo } from "../models/photo.model";
import { delay, Observable, of } from "rxjs";
import { generateTitle } from "../utils/fake-name-generator";

const DEFAULT_PAGE_SIZE = 20;
const MIN_DELAY_MS = 200;
const MAX_DELAY_MS = 300;

@Injectable({ providedIn: 'root' })
export class PhotoService {
    private randomDelay(): number {
        return MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
    }

    getPhotos(page: number, size = DEFAULT_PAGE_SIZE): Observable<Photo[]> {
        const start = (page - 1) * size + 1;
        const photos: Photo[] = Array.from({ length: size }, (_, i) => {
            const id = start + i;
            return {
                id,
                title: generateTitle(id),
                url: `https://picsum.photos/seed/${id}/200/300`,
                fullUrl: `https://picsum.photos/seed/${id}/1200/1800`,
            }
        })
        return of(photos).pipe(delay(this.randomDelay()));
    }
}