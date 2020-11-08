import { combineReducers } from 'redux';
import { authentication, AuthenticationState } from './authentication.reducer';
import { calendar, CalendarState } from './calendar.reducer';
import { workLog, WorkLogState } from './workLog.reducer';
import { registration, RegistrationState } from './registration.reducer';
import { leftMenu, LeftMenuState } from './leftMenu.reducer';
import { notifications, NotificationsState } from './notifications.reducer';
import { admin, AdminState } from './admin.reducer';

export interface OpenTrappState {
  authentication: AuthenticationState;
  calendar: CalendarState;
  workLog: WorkLogState;
  registration: RegistrationState;
  leftMenu: LeftMenuState;
  notifications: NotificationsState;
  admin: AdminState;
}

export const rootReducer = combineReducers({
  authentication,
  calendar,
  workLog,
  registration,
  leftMenu,
  notifications,
  admin
});
