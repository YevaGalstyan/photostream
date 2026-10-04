import { computed, Injectable, signal } from '@angular/core';
import { SearchCriteria } from '../utils/photo-search';

@Injectable({ providedIn: 'root' })
export class SearchService {
  readonly query = signal('');
  readonly tags = signal<string[]>([]);

  readonly criteria = computed<SearchCriteria>(() => ({
    query: this.query().trim(),
    tags: this.tags(),
  }));
  readonly hasFilters = computed(() => this.query() !== '' || this.tags().length > 0);

  toggleTag(tag: string): void {
    this.tags.update((cur) => (cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]));
  }

  clear(): void {
    this.query.set('');
    this.tags.set([]);
  }
}
