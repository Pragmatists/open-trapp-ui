import { combineReducers } from 'redux';
import { authentication, AuthenticationState } from './authentication.reducer';
import { calendar, CalendarState } from './calendar.reducer';
import { workLog, WorkLogState } from './workLog.reducer';
import { registration, RegistrationState } from './registration.reducer';
import { reporting, ReportingState } from './reporting.reducer';
import { leftMenu, LeftMenuState } from './leftMenu.reducer';

export interface OpenTrappState {
  authentication: AuthenticationState;
  calendar: CalendarState;
  workLog: WorkLogState;
  registration: RegistrationState;
  reporting: ReportingState;
  leftMenu: LeftMenuState;
}

export const rootReducer = combineReducers({
  authentication,
  calendar,
  workLog,
  registration,
  reporting,
  leftMenu
});
