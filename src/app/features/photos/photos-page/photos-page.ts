import { Component, inject, signal, WritableSignal } from "@angular/core";
import { DEFAULT_PAGE_SIZE, PhotoService } from "../../../core/services/photo.service";
import { Photo } from "../../../core/models/photo.model";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { InifiteScroll } from "../../../shared/directives/infinite-scroll";
import { MatCard, MatCardContent } from "@angular/material/card";
import { PhotoCard } from "../../../shared/components/photo-card/photo-card";
import { SearchService } from "../../../core/services/search.service";
import { debounceTime, Subscription } from "rxjs";
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { SearchCriteria } from "../../../core/utils/photo-search";
import { SearchBar } from "../../../shared/components/search-bar/search-bar";

@Component({
    selector: 'app-photos-page',
    imports: [MatProgressSpinner, InifiteScroll, PhotoCard, SearchBar],
    templateUrl: './photos-page.html',
    styleUrl: './photos-page.scss',
})
export class PhotosPage {
    private readonly photoService = inject(PhotoService);
    protected readonly search = inject(SearchService);

    protected readonly photos = signal<Photo[]>([]);
    protected readonly loading = signal(false);
    protected readonly done = signal(false);

    private applied: SearchCriteria = this.search.criteria();
    private page = 0;
    private request?: Subscription;

    constructor() {
        toObservable(this.search.criteria)
            .pipe(debounceTime(250), takeUntilDestroyed())
            .subscribe((criteria) => this.applyFilters(criteria));
    }

    protected loadMore(): void {
        if (this.loading()) return;

        this.loading.set(true);
        let nextPage = this.page + 1;
        this.photoService.getPhotos(nextPage, DEFAULT_PAGE_SIZE, this.applied).subscribe((batch) => {
            this.photos.update((current) => [...current, ...batch]);
            if (batch.length < DEFAULT_PAGE_SIZE) this.done.set(true);
            this.loading.set(false);
        });
    }

    onPhotoClick(photo: Photo): void {
        console.log('Photo clicked:', photo);
    }

    private applyFilters(next: SearchCriteria): void {
        const same =
            next.query === this.applied.query &&
            next.tags.length === this.applied.tags.length &&
            next.tags.every((t, i) => t === this.applied.tags[i]);
        if (same) return;

        this.applied = next;
        this.request?.unsubscribe();
        this.photos.set([]);
        this.page = 0;
        this.done.set(false);
        this.loading.set(false);
        this.loadMore();
    }
}
