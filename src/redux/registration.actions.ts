import { ParsedWorkLog } from '../workLogExpressionParser/ParsedWorkLog';
import { Dispatch } from 'redux';
import { REGISTRATION_CONSTANTS } from './constants';
import { OpenTrappRestAPI } from '../api/OpenTrappAPI';
import { OpenTrappState } from './root.reducer';
import { workLogLoadedAction } from './workLog.actions';
import { Preset } from '../components/registrationPage/registration.model';
import { LocalStorage } from '../utils/LocalStorage';
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

export function createPreset(preset: Preset) {
  return (dispatch: Dispatch, getState: () => OpenTrappState) => {
    const state = getState();
    const presets = state.registration.presets;
    LocalStorage.presets = [preset, ...presets];
    return dispatch(presetCreatedAction(preset));
  };
}

export function removePreset(preset: Preset) {
  return (dispatch: Dispatch, getState: () => OpenTrappState) => {
    const state = getState();
    const presets = state.registration.presets;
    LocalStorage.presets = presets.filter(p => p.id !== preset.id);
    return dispatch(presetRemovedAction(preset));
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

const presetCreatedAction = (preset: Preset) => ({
  type: REGISTRATION_CONSTANTS.PRESET_CREATED,
  payload: preset
});

const presetRemovedAction = (preset: Preset) => ({
  type: REGISTRATION_CONSTANTS.PRESET_REMOVED,
  payload: preset
});
