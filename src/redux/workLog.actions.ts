import { Dispatch } from 'redux';
import { OpenTrappRestAPI } from '../api/OpenTrappAPI';
import { WORK_LOG_CONSTANTS } from './constants';

export function loadWorkLog(year: number, month: number) {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.workLogEntriesForMonth(year, month)
        .then(entries => dispatch(workLogLoadedAction(entries)))
        .catch(err => console.error(err));
  };
}

const workLogLoadedAction = (entries) => ({
  type: WORK_LOG_CONSTANTS.WORK_LOG_LOADED,
  payload: entries
});
