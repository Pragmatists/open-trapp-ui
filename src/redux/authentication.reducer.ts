import { AuthorizedUser } from '../api/dtos';
import { AUTHENTICATION_CONSTANTS } from './constants';

const storageUser = localStorage.getItem('OpenTrappUser');
const user: AuthorizedUser = storageUser ? JSON.parse(storageUser) : undefined;

export interface AuthenticationState {
  loggedIn: boolean;
  user?: AuthorizedUser;
}

const initialState = user ? {loggedIn: true, user} : {loggedIn: false};

export function authentication(state: AuthenticationState = initialState, action: any): AuthenticationState {
  switch (action.type) {
    case AUTHENTICATION_CONSTANTS.LOGIN_SUCCESS:
      return {loggedIn: true, user: action.payload};
    case AUTHENTICATION_CONSTANTS.LOGOUT:
      return {loggedIn: false};
    default:
      return state;
  }
}

