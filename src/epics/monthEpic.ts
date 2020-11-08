import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { CALENDAR_CONSTANTS } from '../actions/constants';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OpenTrappState } from '../redux/root.reducer';
import { MonthChangedAction, monthLoadedAction } from '../actions/calendar.actions';
import { OpenTrappAPI } from '../api/OpenTrappAPI';
import { errorNotificationAction } from '../actions/notifications.actions';

export const loadMonthEpic = (action$: ActionsObservable<MonthChangedAction>, state$: StateObservable<OpenTrappState>, { openTrappApi }: {openTrappApi: OpenTrappAPI}) =>
    action$.pipe(
        ofType(CALENDAR_CONSTANTS.MONTH_CHANGED),
        map(a => a.payload),
        switchMap(({year, month}) => openTrappApi.calendarMonth(year, month)),
        map(m => monthLoadedAction(m)),
        catchError(err => {
            console.error(err);
            return of(errorNotificationAction('Month data fetching failed'));
        })
    );
