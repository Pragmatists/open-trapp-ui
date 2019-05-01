import { AuthorizedUser } from '../api/dtos';
import { isExpired } from './jwtUtils';

export class LocalStorage {
  static readonly AUTHORIZED_USER_KEY = 'OpenTrappUser';

  static get authorizedUser(): AuthorizedUser | null {
    const storageUser = localStorage.getItem(LocalStorage.AUTHORIZED_USER_KEY);
    const user: AuthorizedUser = storageUser ? JSON.parse(storageUser) : undefined;
    if (!user) {
      return;
    }
    if (isExpired(user.token)) {
      localStorage.removeItem(LocalStorage.AUTHORIZED_USER_KEY);
      return null;
    }
    return user;
  }

  static set authorizedUser(user: AuthorizedUser) {
    localStorage.setItem(this.AUTHORIZED_USER_KEY, JSON.stringify(user));
  }

  static clearAuthorizedUser() {
    localStorage.removeItem(this.AUTHORIZED_USER_KEY);
  }
}
