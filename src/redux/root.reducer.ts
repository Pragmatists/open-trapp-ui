import { combineReducers } from 'redux';
import { authentication, AuthenticationState } from './authentication.reducer';
import { calendar, CalendarState } from './calendar.reducer';
import { workLog, WorkLogState } from './workLog.reducer';
import { registration, RegistrationState } from './registration.reducer';

export interface OpenTrappState {
  authentication: AuthenticationState;
  calendar: CalendarState;
  workLog: WorkLogState;
  registration: RegistrationState;
}

export const rootReducer = combineReducers({
  authentication,
  calendar,
  workLog,
  registration
});
