import { uniqueEmail } from '../utils/testData';

export interface TestUser {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}

export function buildTestUser(overrides: Partial<TestUser> = {}): TestUser {
  return {
    name: 'QA Portfolio Bot',
    email: uniqueEmail('api-portfolio'),
    password: 'Test1234!',
    title: 'Mr',
    birth_date: '1',
    birth_month: '1',
    birth_year: '1999',
    firstname: 'QA',
    lastname: 'Bot',
    company: 'Portfolio',
    address1: '1 Test Street',
    address2: '',
    country: 'Japan',
    zipcode: '100-0001',
    state: 'Tokyo',
    city: 'Tokyo',
    mobile_number: '0000000000',
    ...overrides,
  };
}
