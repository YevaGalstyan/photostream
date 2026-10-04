import { TestBed } from '@angular/core/testing';
import { SearchService } from '../../../core/services/search.service';
import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchBar],
      providers: [SearchService],
    });
  });

  it('updates the search query from the input', () => {
    const fixture = TestBed.createComponent(SearchBar);
    const search = TestBed.inject(SearchService);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'mountain';
    input.dispatchEvent(new Event('input'));

    expect(search.query()).toBe('mountain');
  });

  it('clears the query and tags', () => {
    const fixture = TestBed.createComponent(SearchBar);
    const search = TestBed.inject(SearchService);
    search.query.set('mountain');
    search.tags.set(['nature']);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.unfilter').click();

    expect(search.query()).toBe('');
    expect(search.tags()).toEqual([]);
  });
});