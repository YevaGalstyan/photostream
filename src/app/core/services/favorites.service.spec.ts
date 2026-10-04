import { TestBed } from "@angular/core/testing";
import { Photo } from "../models/photo.model";
import { FavoritesService } from "./favorites.service";
import { StorageService } from "./storage.service";

describe("FavoritesService", () => {
    const firstPhoto: Photo = {
        id: 1,
        title: "First photo",
        tags: ["nature"],
        url: "first-url",
        fullUrl: "first-full-url",
    };
    const secondPhoto: Photo = {
        id: 2,
        title: "Second photo",
        tags: ["city"],
        url: "second-url",
        fullUrl: "second-full-url",
    };

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            providers: [FavoritesService, StorageService],
        });
    });

    afterEach(() => {
        localStorage.clear();
        TestBed.resetTestingModule();
    });

    it("adds a favorite", () => {
        const service = TestBed.inject(FavoritesService);

        service.add(firstPhoto);

        expect(service.favorites()).toEqual([firstPhoto]);
        expect(service.isFavorite(firstPhoto.id)).toBe(true);
        expect(service.get(firstPhoto.id)).toEqual(firstPhoto);
    });

    it("does not add the same favorite twice", () => {
        const service = TestBed.inject(FavoritesService);

        service.add(firstPhoto);
        service.add(firstPhoto);

        expect(service.favorites()).toEqual([firstPhoto]);
    });

    it("removes a favorite", () => {
        const service = TestBed.inject(FavoritesService);
        service.add(firstPhoto);
        service.add(secondPhoto);

        service.remove(firstPhoto.id);

        expect(service.favorites()).toEqual([secondPhoto]);
        expect(service.isFavorite(firstPhoto.id)).toBe(false);
    });

    it("toggles favorites on and off", () => {
        const service = TestBed.inject(FavoritesService);

        service.toggle(firstPhoto);
        expect(service.isFavorite(firstPhoto.id)).toBe(true);

        service.toggle(firstPhoto);
        expect(service.isFavorite(firstPhoto.id)).toBe(false);
        expect(service.favorites()).toEqual([]);
    });

    it("loads favorites saved by a previous instance", () => {
        const firstService = TestBed.inject(FavoritesService);
        firstService.add(firstPhoto);
        TestBed.flushEffects();

        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [FavoritesService, StorageService],
        });

        const secondService = TestBed.inject(FavoritesService);

        expect(secondService.favorites()).toEqual([firstPhoto]);
    });
});