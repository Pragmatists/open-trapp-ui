import { Action } from 'redux';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { map, switchMap } from 'rxjs/operators';
import { OpenTrappState } from '../redux/root.reducer';
import { OpenTrappAPI } from '../api/OpenTrappAPI';
import { ADMIN_CONSTANTS } from '../actions/constants';
import {
    authorizedUsersLoadedAction,
    DeleteServiceAccountAction,
    serviceAccountDeletedAction,
    serviceAccountsLoadedAction
} from '../actions/admin.actions';

export const loadServiceAccountsEpic = (action$: ActionsObservable<Action>, state$: StateObservable<OpenTrappState>, {openTrappApi}: { openTrappApi: OpenTrappAPI }) =>
    action$.pipe(
        ofType(ADMIN_CONSTANTS.LOAD_SERVICE_ACCOUNTS),
        switchMap(_ => openTrappApi.serviceAccounts),
        map(serviceAccounts => serviceAccountsLoadedAction(serviceAccounts))
    );

export const deleteServiceAccountEpic = (action$: ActionsObservable<DeleteServiceAccountAction>, state$: StateObservable<OpenTrappState>, {openTrappApi}: { openTrappApi: OpenTrappAPI }) =>
    action$.pipe(
        ofType(ADMIN_CONSTANTS.DELETE_SERVICE_ACCOUNT),
        map(a => a.payload),
        switchMap(id => openTrappApi.deleteServiceAccount(id)),
        map(id => serviceAccountDeletedAction(id))
    );

export const loadAuthorizedUsersEpic = (action$: ActionsObservable<Action>, state$: StateObservable<OpenTrappState>, {openTrappApi}: { openTrappApi: OpenTrappAPI }) =>
    action$.pipe(
        ofType(ADMIN_CONSTANTS.LOAD_AUTHORIZED_USERS),
        switchMap(_ => openTrappApi.authorizedUsers),
        map(authorizedUsers => authorizedUsersLoadedAction(authorizedUsers))
    );
