import { Component, inject, signal } from "@angular/core";
import { PhotoService } from "../../../core/services/photo.service";
import { Photo } from "../../../core/models/photo.model";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { InifiteScroll } from "../../../shared/directives/infinite-scroll";
import { MatCard, MatCardContent } from "@angular/material/card";

@Component({
 selector: 'app-photos-page',
  imports: [MatProgressSpinner, InifiteScroll, MatCard, MatCardContent],
  templateUrl: './photos-page.html',
  styleUrl: './photos-page.scss',
})
export class PhotosPage {
    private readonly photoService = inject(PhotoService);
    
    protected readonly photos = signal<Photo[]>([]);
    protected readonly loading = signal(false);
    private page = 0;

    protected loadMore(): void {
        if(this.loading()) return;

        this.loading.set(true);
        let nextPage = this.page + 1;
        this.photoService.getPhotos(nextPage).subscribe((batch) => {
            this.photos.update((current) => [...current, ...batch]);
            this.loading.set(false);
        })
    }
}