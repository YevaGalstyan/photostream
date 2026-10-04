import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { InifiteScroll } from "./infinite-scroll";

class MockIntersectionObserver {
    static latest?: MockIntersectionObserver;
    readonly rootMargin: string;
    observeCalls = 0;
    disconnectCalls = 0;
    private readonly callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.callback = callback;
        this.rootMargin = options?.rootMargin ?? "";
        MockIntersectionObserver.latest = this;
    }

    observe(): void {
        this.observeCalls++;
    }

    disconnect(): void {
        this.disconnectCalls++;
    }

    trigger(isIntersecting: boolean): void {
        this.callback(
            [{ isIntersecting } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
        );
    }
}

@Component({
    standalone: true,
    imports: [InifiteScroll],
    template: '<div appInfiniteScroll [rootMargin]="rootMargin" (scrolled)="onScrolled()"></div>',
})
class TestHost {
    rootMargin = "50px";
    scrollEvents = 0;

    onScrolled(): void {
        this.scrollEvents++;
    }
}

describe("InifiteScroll", () => {
    const originalIntersectionObserver = globalThis.IntersectionObserver;

    beforeEach(() => {
        MockIntersectionObserver.latest = undefined;
        globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
        TestBed.configureTestingModule({ imports: [TestHost] });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
        globalThis.IntersectionObserver = originalIntersectionObserver;
    });

    it("emits when the element intersects", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        const observer = MockIntersectionObserver.latest!;

        observer.trigger(false);
        observer.trigger(true);

        expect(fixture.componentInstance.scrollEvents).toBe(1);
        expect(observer.rootMargin).toBe("50px");
        expect(observer.observeCalls).toBe(1);
    });

    it("disconnects the observer when destroyed", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        const observer = fixture.debugElement.query(By.directive(InifiteScroll))
            .injector.get(InifiteScroll);

        fixture.destroy();

        expect(observer).toBeTruthy();
        expect(MockIntersectionObserver.latest?.disconnectCalls).toBe(1);
    });
});