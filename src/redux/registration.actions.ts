import { ParsedWorkLog } from '../workLogExpressionParser/ParsedWorkLog';
import { Dispatch } from 'redux';
import { REGISTRATION_CONSTANTS } from './constants';
import { OpenTrappRestAPI } from '../api/OpenTrappAPI';
import { OpenTrappState } from './root.reducer';
import { workLogLoadedAction } from './workLog.actions';
import { Preset } from '../components/registrationPage/registration.model';
import { errorNotificationAction, infoNotificationAction } from './notifications.actions';

export function changeWorkLog(workLog: ParsedWorkLog) {
  return (dispatch: Dispatch) => dispatch(workLogChangedAction(workLog));
}

export function saveWorkLog(workLog: ParsedWorkLog) {
  return (dispatch: Dispatch, getState: () => OpenTrappState) => {
    const state = getState();
    const username = state.authentication.user.name;

    Promise.all(workLog.days.map(d => OpenTrappRestAPI.saveWorkLog(d, workLog.tags, workLog.workload, username)))
        .then(() => dispatch(workLogSavedAction()))
        .then(() => dispatch(infoNotificationAction('Work log created')))
        .then(() => OpenTrappRestAPI.workLogEntriesForMonth(state.calendar.selectedMonth.year, state.calendar.selectedMonth.month))
        .then(entries => dispatch(workLogLoadedAction(entries)))
        .catch(err => {
          dispatch(errorNotificationAction('Saving work log failed'));
          return console.error(err);
        });
  };
}

export function loadPresets() {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.presets
        .then(presets => presets.map(p => new Preset(p)))
        .then(presets => dispatch(presetsLoadedAction(presets)))
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

const presetsLoadedAction = (presets: Preset[]) => ({
  type: REGISTRATION_CONSTANTS.PRESETS_LOADED,
  payload: presets
});