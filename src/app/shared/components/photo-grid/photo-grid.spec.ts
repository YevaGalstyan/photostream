import { TestBed } from "@angular/core/testing";
import { Photo } from "../../../core/models/photo.model";
import { PhotoGrid } from "./photo-grid";

describe("PhotoGrid", () => {
    it("renders one photo card for each photo", () => {
        const photos: Photo[] = [
            { id: 1, title: "First", tags: [], url: "first", fullUrl: "first-full" },
            { id: 2, title: "Second", tags: [], url: "second", fullUrl: "second-full" },
        ];
        TestBed.configureTestingModule({ imports: [PhotoGrid] });
        const fixture = TestBed.createComponent(PhotoGrid);
        fixture.componentRef.setInput("photos", photos);
        fixture.componentRef.setInput("favoriteIds", new Set([2]));
        fixture.detectChanges();

        const cards = fixture.nativeElement.querySelectorAll("app-photo-card");

        expect(cards.length).toBe(2);
        expect(cards[1].querySelector(".heart").getAttribute("aria-pressed")).toBe("true");
    });
});