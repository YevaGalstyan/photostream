import { faker } from '@faker-js/faker/locale/en';

export function generateTitle(id: number): string {
  faker.seed(id);
  return `${faker.word.adjective()} ${faker.location.city()}`;
}
