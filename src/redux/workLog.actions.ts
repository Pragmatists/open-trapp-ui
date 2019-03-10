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

export function loadTags() {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.tags()
        .then(tags => dispatch(tagsLoadedAction(tags)))
        .catch(err => console.error(err));
  };
}

export const workLogLoadedAction = entries => ({
  type: WORK_LOG_CONSTANTS.WORK_LOG_LOADED,
  payload: entries
});

const tagsLoadedAction = tags => ({
  type: WORK_LOG_CONSTANTS.TAGS_LOADED,
  payload: tags
});
