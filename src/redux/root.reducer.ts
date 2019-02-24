import { combineReducers } from 'redux';
import { authentication, AuthenticationState } from './authentication.reducer';
import { calendar, CalendarState } from './calendar.reducer';

export interface OpenTrappState {
  authentication: AuthenticationState;
  calendar: CalendarState;
}

export const rootReducer = combineReducers({
  authentication,
  calendar
});
