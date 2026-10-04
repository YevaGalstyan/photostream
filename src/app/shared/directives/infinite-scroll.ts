import { Directive, ElementRef, inject, input, OnDestroy, OnInit, output } from '@angular/core';

@Directive({ selector: '[appInfiniteScroll]' })
export class InfiniteScroll implements OnInit, OnDestroy {
  readonly scrolled = output<void>();
  readonly rootMargin = input('200px');

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) this.scrolled.emit();
      },
      { rootMargin: this.rootMargin() },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
