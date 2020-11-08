import { uniq } from 'lodash';
import { OpenTrappState } from '../redux/root.reducer';

export const userTagsSelector = (state: OpenTrappState): string[] => {
  const workLogs = state.workLog.workLogs || [];
  const username = state.authentication.user?.name;
  const tags = workLogs
      .filter(w => w.employee === username)
      .map(w => w.projectNames)
      .reduce((curr, prev) => [...curr, ...prev], []);
  return uniq(tags);
}

export const usernameSelector = (state: OpenTrappState) => state.authentication.user?.name;

export const userLoggedInSelector = (s: OpenTrappState) => s.authentication.loggedIn;

export const selectedMonthSelector = (state: OpenTrappState) => state.calendar.selectedMonth;
