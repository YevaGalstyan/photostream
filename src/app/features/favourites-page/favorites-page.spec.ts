import { provideRouter } from "@angular/router";
import { TestBed } from "@angular/core/testing";
import { Photo } from "../../core/models/photo.model";
import { FavoritesService } from "../../core/services/favorites.service";
import { StorageService } from "../../core/services/storage.service";
import { SearchService } from "../../core/services/search.service";
import { FavoritesPage } from "./favorites-page";

describe("FavoritesPage", () => {
    const photo: Photo = {
        id: 1,
        title: "Test photo",
        tags: ["nature"],
        url: "photo-url",
        fullUrl: "full-photo-url",
    };

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            imports: [FavoritesPage],
            providers: [provideRouter([]), FavoritesService, StorageService, SearchService],
        });
    });

    afterEach(() => {
        localStorage.clear();
        TestBed.resetTestingModule();
    });

    it("renders the empty state when there are no favorites", () => {
        const fixture = TestBed.createComponent(FavoritesPage);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector(".empty").textContent).toContain("No favorites yet");
    });

    it("renders the filtered empty state when favorites do not match", () => {
        const favorites = TestBed.inject(FavoritesService);
        const search = TestBed.inject(SearchService);
        favorites.add(photo);
        search.query.set("missing");
        const fixture = TestBed.createComponent(FavoritesPage);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector(".empty").textContent).toContain(
            "No favorites match your filters",
        );
    });
});