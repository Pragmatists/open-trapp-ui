import { Dispatch } from 'redux';
import { OpenTrappRestAPI } from '../api/OpenTrappAPI';
import { WORK_LOG_CONSTANTS } from './constants';
import { BulkEditDTO, ReportingWorkLogDTO } from '../api/dtos';
import { errorNotificationAction, infoNotificationAction } from './notifications.actions';
import { OpenTrappState } from './root.reducer';
import { logout } from './authentication.actions';

export function loadWorkLogs(year: number, month: number) {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.workLogEntriesForMonth(year, month)
        .then(entries => dispatch(workLogLoadedAction(entries)))
        .catch(err => {
          if (err?.response?.status === 401) {
            console.error('User unauthorized', err);
            logout()(dispatch)
            document.location.reload()
          }
          console.error('Request failed', err)
        });
  };
}

export function loadTags(numberOfPastMonths?: number) {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.tags(numberOfPastMonths)
        .then(tags => dispatch(tagsLoadedAction(tags)))
        .catch(err => console.error(err));
  };
}

export function updateWorkLog(id: string, tags: string[], workload: string) {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.updateWorkLog(id, tags, workload)
        .then(workLog => dispatch(workLogUpdatedAction(workLog)))
        .then(() => dispatch(infoNotificationAction('Work log updated')))
        .catch(err => {
          dispatch(errorNotificationAction('Updating work log failed'));
          return console.error(err);
        });
  }
}

export function removeWorkLog(id: string) {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.removeWorkLog(id)
        .then(() => dispatch(workLogRemovedAction(id)))
        .then(() => dispatch(infoNotificationAction('Work log removed')))
        .catch(err => {
          dispatch(errorNotificationAction('Removing work log failed'));
          return console.error(err);
        });
  }
}

export function bulkEditWorkLogs(editDto: BulkEditDTO) {
  return (dispatch: Dispatch, getState: () => OpenTrappState) => {
    const state = getState();
    const {year, month} = state.calendar.selectedMonth;
    OpenTrappRestAPI.bulkEdit(editDto)
        .then(() => OpenTrappRestAPI.workLogEntriesForMonth(year, month))
        .then(entries => dispatch(workLogLoadedAction(entries)))
        .catch(err => {
          dispatch(errorNotificationAction('Bulk edit failed'));
          return console.error(err);
        });
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
