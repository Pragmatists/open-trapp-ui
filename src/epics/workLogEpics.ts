import { of, from, concat } from 'rxjs';
import { Action } from 'redux';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { OpenTrappState } from '../redux/root.reducer';
import { isNil } from 'lodash';
import { CALENDAR_CONSTANTS, REGISTRATION_CONSTANTS, WORK_LOG_CONSTANTS } from '../actions/constants';
import { catchError, map, mergeMap, withLatestFrom, mergeAll, ignoreElements } from 'rxjs/operators';
import {
  bulkEditDoneAction,
  tagsLoadedAction,
  workLogLoadedAction,
  workLogRemovedAction, workLogSavedAction,
  workLogUpdatedAction
} from '../actions/workLog.actions';
import { OpenTrappAPI } from '../api/OpenTrappAPI';
import { errorNotificationAction, infoNotificationAction } from '../actions/notifications.actions';
import { ParsedWorkLog } from '../workLogExpressionParser/ParsedWorkLog';
import { BulkEditDTO } from '../api/dtos';

export const loadWorkLogsEpic = (action$: ActionsObservable<Action>, state$: StateObservable<OpenTrappState>, {openTrappApi}: { openTrappApi: OpenTrappAPI }) =>
    action$.pipe(
        ofType(CALENDAR_CONSTANTS.MONTH_CHANGED, WORK_LOG_CONSTANTS.LOAD_WORK_LOGS, CALENDAR_CONSTANTS.LOAD_MONTH, REGISTRATION_CONSTANTS.WORK_LOG_SAVED, WORK_LOG_CONSTANTS.BULK_EDIT_DONE),
        map((a: any) => a.payload as { year: number, month: number }),
        withLatestFrom(state$.pipe(map(s => s.calendar.selectedMonth))),
        map(([actionMonth, stateMonth]) => isNil(actionMonth) ? stateMonth : actionMonth),
        mergeMap(({year, month}) => openTrappApi.workLogEntries(year, month)),
        map(e => workLogLoadedAction(e)),
        catchError(e => {
          console.error('Workloads fetching failed', e)
          return of(errorNotificationAction('Workloads fetching failed'));
        })
    );

export const removeWorkLogEpic = (action$: ActionsObservable<Action>, state$: StateObservable<OpenTrappState>, {openTrappApi}: { openTrappApi: OpenTrappAPI }) =>
    action$.pipe(
        ofType(WORK_LOG_CONSTANTS.REMOVE_WORK_LOG),
        map((a: any) => a.payload as string),
        mergeMap(id => openTrappApi.removeWorkLog(id)),
        mergeMap(id => [workLogRemovedAction(id), infoNotificationAction('Work log removed')]),
        catchError(e => {
          console.error('Removal of worklog failed', e);
          return of(errorNotificationAction('Removing work log failed'));
        })
    );

const saveWorkLogs = (workLog: ParsedWorkLog, username: string, openTrappApi: OpenTrappAPI) => {
  return from(workLog.days.map(d => openTrappApi.saveWorkLog(username, d, workLog.tags, workLog.workload, workLog.note))).pipe(
      mergeAll(),
      ignoreElements()
  );
}

export const saveWorkLogEpic = (action$: ActionsObservable<Action>, state$: StateObservable<OpenTrappState>, {openTrappApi}: { openTrappApi: OpenTrappAPI }) =>
    action$.pipe(
        ofType(WORK_LOG_CONSTANTS.SAVE_WORK_LOG),
        map((a: any) => a.payload as ParsedWorkLog),
        withLatestFrom(state$.pipe(map(s => s.authentication.user?.name))),
        mergeMap(([workLog, username]) => concat(
            saveWorkLogs(workLog, username, openTrappApi),
            of(workLogSavedAction()),
            of(infoNotificationAction('Work log created'))
        )),
    );

export const updateWorkLogEpic = (action$: ActionsObservable<Action>, state$: StateObservable<OpenTrappState>, {openTrappApi}: { openTrappApi: OpenTrappAPI }) =>
    action$.pipe(
        ofType(WORK_LOG_CONSTANTS.UPDATE_WORK_LOG),
        map((a: any) => a.payload as { id: string, tags: string[], workload: string }),
        mergeMap(({id, tags, workload}) => openTrappApi.updateWorkLog(id, tags, workload)),
        mergeMap(w => [workLogUpdatedAction(w), infoNotificationAction('Work log updated')]),
        catchError(e => {
          console.error(e);
          return of(errorNotificationAction('Update of work log failed'));
        })
    );

export const bulkEditWorkLogsEpic = (action$: ActionsObservable<Action>, state$: StateObservable<OpenTrappState>, {openTrappApi}: { openTrappApi: OpenTrappAPI }) =>
    action$.pipe(
        ofType(WORK_LOG_CONSTANTS.BULK_EDIT_REQUEST),
        map((a: any) => a.payload as BulkEditDTO),
        mergeMap(dto => openTrappApi.bulkEdit(dto)),
        map(bulkEditDoneAction),
        catchError(e => {
          console.error(e);
          return of(errorNotificationAction('Bulk edit failed'))
        })
    );

export const loadTagsEpic = (action$: ActionsObservable<Action>, state$: StateObservable<OpenTrappState>, {openTrappApi}: { openTrappApi: OpenTrappAPI }) =>
    action$.pipe(
        ofType(WORK_LOG_CONSTANTS.LOAD_TAGS),
        map((a: any) => a.payload as number),
        mergeMap(numberOfPastMonths => openTrappApi.tags(numberOfPastMonths)),
        map(tagsLoadedAction)
    )
