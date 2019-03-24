import { Dispatch } from 'redux';
import { OpenTrappRestAPI } from '../api/OpenTrappAPI';
import { WORK_LOG_CONSTANTS } from './constants';
import { ReportingWorkLogDTO } from '../api/dtos';

export function loadWorkLogs(year: number, month: number) {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.workLogEntriesForMonth(year, month)
        .then(entries => dispatch(workLogLoadedAction(entries)))
        .catch(err => console.error(err));
  };
}

export function loadTags() {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.tags
        .then(tags => dispatch(tagsLoadedAction(tags)))
        .catch(err => console.error(err));
  };
}

export function updateWorkLog(id: string, tags: string[], workload: string) {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.updateWorkLog(id, tags, workload)
        .then(workLog => dispatch(workLogUpdatedAction(workLog)))
        .catch(err => console.error(err));
  }
}

export function removeWorkLog(id: string) {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.removeWorkLog(id)
        .then(() => dispatch(workLogRemovedAction(id)))
        .catch(err => console.error(err));
  }
}

export const workLogLoadedAction = entries => ({
  type: WORK_LOG_CONSTANTS.WORK_LOGS_LOADED,
  payload: entries
});

const tagsLoadedAction = tags => ({
  type: WORK_LOG_CONSTANTS.TAGS_LOADED,
  payload: tags
});

const workLogUpdatedAction = (workLog: ReportingWorkLogDTO) => ({
  type: WORK_LOG_CONSTANTS.WORK_LOG_UPDATED,
  payload: workLog
});

const workLogRemovedAction = (id: string) => ({
  type: WORK_LOG_CONSTANTS.WORK_LOG_REMOVED,
  payload: id
});
