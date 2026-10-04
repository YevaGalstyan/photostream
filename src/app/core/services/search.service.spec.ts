import { SearchService } from "./search.service";

describe("SearchService", () => {
    let service: SearchService;

    beforeEach(() => {
        service = new SearchService();
    });

    it("adds and removes a tag when toggled", () => {
        service.toggleTag("nature");

        expect(service.tags()).toEqual(["nature"]);
        expect(service.hasFilters()).toBe(true);

        service.toggleTag("nature");

        expect(service.tags()).toEqual([]);
        expect(service.hasFilters()).toBe(false);
    });

    it("reports filters from a query or selected tags", () => {
        expect(service.hasFilters()).toBe(false);

        service.query.set("mountain");
        expect(service.hasFilters()).toBe(true);

        service.clear();
        service.toggleTag("nature");
        expect(service.hasFilters()).toBe(true);
    });

    it("clears the query and selected tags", () => {
        service.query.set("mountain");
        service.toggleTag("nature");

        service.clear();

        expect(service.query()).toBe("");
        expect(service.tags()).toEqual([]);
        expect(service.criteria()).toEqual({ query: "", tags: [] });
        expect(service.hasFilters()).toBe(false);
    });
});