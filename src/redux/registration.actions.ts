import { ParsedWorkLog } from '../workLogExpressionParser/WorkLogExpressionParser';
import { Dispatch } from 'redux';
import { REGISTRATION_CONSTANTS } from './constants';
import { OpenTrappRestAPI } from '../api/OpenTrappAPI';
import { OpenTrappState } from './root.reducer';
import { workLogLoadedAction } from './workLog.actions';

export function changeWorkLog(workLog: ParsedWorkLog) {
  return (dispatch: Dispatch) => dispatch(workLogChangedAction(workLog));
}

export function saveWorkLog(workLog: ParsedWorkLog) {
  return (dispatch: Dispatch, getState: () => OpenTrappState) => {
    const state = getState();
    const username = state.authentication.user.name;
    OpenTrappRestAPI.saveWorkLog(workLog.days[0], workLog.tags, workLog.workload, username)
        .then(() => dispatch(workLogSavedAction()))
        .then(() => OpenTrappRestAPI.workLogEntriesForMonth(state.calendar.selectedMonth.year, state.calendar.selectedMonth.month))
        .then(entries => dispatch(workLogLoadedAction(entries)))
        .catch(err => console.error(err));
  };
}

const workLogChangedAction = (workLog: ParsedWorkLog) => ({
  type: REGISTRATION_CONSTANTS.WORK_LOG_CHANGED,
  payload: {
    days: workLog.days,
    tags: workLog.tags,
    workload: workLog.workload,
    expression: workLog.expression,
    valid: workLog.valid
  }
});

const workLogSavedAction = () => ({
  type: REGISTRATION_CONSTANTS.WORK_LOG_SAVED
});