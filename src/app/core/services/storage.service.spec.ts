import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    service = new StorageService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('round trips values through local storage', () => {
    const value = { ids: [1, 2, 3], enabled: true };

    service.set('preferences', value);

    expect(service.get('preferences', {})).toEqual(value);
  });

  it('returns the fallback when stored JSON is invalid', () => {
    const fallback = { ids: [], enabled: false };
    localStorage.setItem('preferences', '{invalid-json');

    expect(service.get('preferences', fallback)).toBe(fallback);
  });
});
