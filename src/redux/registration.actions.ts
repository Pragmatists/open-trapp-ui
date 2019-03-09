import { ParsedWorkLog } from '../workLogExpressionParser/WorkLogExpressionParser';
import { Dispatch } from 'redux';
import { REGISTRATION_CONSTANTS } from './constants';
import { OpenTrappRestAPI } from '../api/OpenTrappAPI';

export function changeWorkLog(workLog: ParsedWorkLog) {
  return (dispatch: Dispatch) => dispatch(workLogChangedAction(workLog));
}

export function saveWorkLog(workLog: ParsedWorkLog) {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.saveWorkLog(workLog.days[0], workLog.tags, workLog.workload)
        .then(() => dispatch(workLogSavedAction()))
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