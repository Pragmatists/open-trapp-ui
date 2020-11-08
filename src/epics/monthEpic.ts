import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { CALENDAR_CONSTANTS } from '../actions/constants';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { OpenTrappState } from '../redux/root.reducer';
import { monthLoadedAction } from '../actions/calendar.actions';
import { OpenTrappAPI } from '../api/OpenTrappAPI';
import { errorNotificationAction } from '../actions/notifications.actions';
import { isNil } from 'lodash';
import { selectedMonthSelector } from '../selectors/selectors';
import { Action } from 'redux';

export const loadMonthEpic = (action$: ActionsObservable<Action>, state$: StateObservable<OpenTrappState>, { openTrappApi }: {openTrappApi: OpenTrappAPI}) =>
    action$.pipe(
        ofType(CALENDAR_CONSTANTS.MONTH_CHANGED, CALENDAR_CONSTANTS.LOAD_MONTH),
        map((a: any) => a.payload as { year: number, month: number }),
        withLatestFrom(state$.pipe(map(selectedMonthSelector))),
        map(([actionMonth, stateMonth]) => isNil(actionMonth) ? stateMonth : actionMonth),
        switchMap(({year, month}) => openTrappApi.calendarMonth(year, month)),
        map(m => monthLoadedAction(m)),
        catchError(err => {
            console.error(err);
            return of(errorNotificationAction('Month data fetching failed'));
        })
    );
