import { AuthorizedUser } from '../api/dtos';
import { isExpired } from './jwtUtils';
import { Preset } from '../components/registrationPage/registration.model';

export class LocalStorage {
  static readonly AUTHORIZED_USER_KEY = 'OpenTrappUser';
  static readonly PRESETS_KEY = 'OpenTrappPresets';

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

  static get presets(): Preset[] {
    const storagePresets = localStorage.getItem(LocalStorage.PRESETS_KEY);
    if (!storagePresets) {
      return [];
    }
    return JSON.parse(storagePresets).map(p => new Preset(p.tags, p.id));
  }

  static set presets(presets: Preset[]) {
    localStorage.setItem(
        this.PRESETS_KEY,
        JSON.stringify(presets.map(p => p.serialize()))
    );
  }
}
