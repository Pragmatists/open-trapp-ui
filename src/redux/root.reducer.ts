import { combineReducers } from 'redux';
import { authentication, AuthenticationState } from './authentication.reducer';

export interface OpenTrappState {
  authentication: AuthenticationState;
}

export const rootReducer = combineReducers({
  authentication
});