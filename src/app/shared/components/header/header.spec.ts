import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { Header } from './header';

describe('Header', () => {
  it('renders links for photos and favorites', () => {
    TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('nav a');

    expect(links.length).toBe(2);
    expect(links[0].textContent).toContain('Photos');
    expect(links[0].getAttribute('href')).toBe('/');
    expect(links[1].textContent).toContain('Favorites');
    expect(links[1].getAttribute('href')).toBe('/favorites');
  });
});
