import { AuthorizedUser } from '../api/dtos';
import { LocalStorage } from './LocalStorage';
import { someJwtToken } from './jwtUtils';

describe('LocalStorage', () => {
  afterEach(() => {
    localStorage.removeItem(LocalStorage.AUTHORIZED_USER_KEY);
  });

  it('stores user details in local storage', () => {
    const userDetails = someUserDetails('John Doe');

    LocalStorage.authorizedUser = userDetails;

    expect(localStorage.getItem(LocalStorage.AUTHORIZED_USER_KEY)).toEqual(JSON.stringify(userDetails));
  });

  it('returns user details from storage', () => {
    const userDetails = someUserDetails('John Doe');
    localStorage.setItem(LocalStorage.AUTHORIZED_USER_KEY, JSON.stringify(userDetails));

    expect(LocalStorage.authorizedUser).toEqual(userDetails);
  });

  it('returns NULL if expired token and removes from local storage', () => {
    const userDetails = userDetailsWithExpiredToken('John Doe');
    localStorage.setItem(LocalStorage.AUTHORIZED_USER_KEY, JSON.stringify(userDetails));

    expect(LocalStorage.authorizedUser).toBeNull();
    expect(localStorage.getItem(LocalStorage.AUTHORIZED_USER_KEY)).toBeNull();
  });

  function someUserDetails(displayName: string): AuthorizedUser {
    const name = displayName.toLowerCase().replace(' ', '.');
    return {
      token: someJwtToken(displayName),
      displayName,
      name,
      email: `${name}@pragmatists.pl`,
      profilePicture: 'https://some-photo-domain.com/photo.jpg',
      roles: ['USER', 'ADMIN']
    };
  }

  function userDetailsWithExpiredToken(displayName: string): AuthorizedUser {
    return {
      token: someJwtToken(displayName, false),
      displayName,
      name,
      email: `${name}@pragmatists.pl`,
      profilePicture: 'https://some-photo-domain.com/photo.jpg',
      roles: ['USER', 'ADMIN']
    };
  }
});
