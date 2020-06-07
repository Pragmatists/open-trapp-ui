import { Dispatch } from 'redux';
import { OpenTrappRestAPI } from '../api/OpenTrappAPI';
import { ADMIN_CONSTANTS } from './constants';
import { AuthorizedUserDTO, ServiceAccountDTO } from '../api/dtos';

export function loadServiceAccounts() {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.serviceAccounts
        .then(serviceAccounts => dispatch(serviceAccountsLoadedAction(serviceAccounts)))
        .catch(err => console.error(err));
  };
}

export function deleteServiceAccount(id: string) {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.deleteServiceAccount(id)
        .then(() => dispatch(serviceAccountDeletedAction(id)))
        .catch(err => console.error(err));
  };
}

export function loadAuthorizedUsers() {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.authorizedUsers
        .then(authorizedUsers => dispatch(authorizedUsersLoadedAction(authorizedUsers)))
        .catch(err => console.error(err));
  };
}

export function updateAuthorizedUser(user: AuthorizedUserDTO) {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.updateAuthorizedUser(user.name, user.roles)
        .then(() => dispatch(authorizedUserUpdatedAction(user)))
        .catch(err => console.error(err))
  }
}

const serviceAccountsLoadedAction = (accounts: ServiceAccountDTO[]) => ({
  type: ADMIN_CONSTANTS.SERVICE_ACCOUNTS_LOADED,
  payload: accounts
});

const serviceAccountDeletedAction = (id: string) => ({
  type: ADMIN_CONSTANTS.SERVICE_ACCOUNT_DELETED,
  payload: id
});

const authorizedUsersLoadedAction = (users: AuthorizedUserDTO[]) => ({
  type: ADMIN_CONSTANTS.AUTHORIZED_USERS_LOADED,
  payload: users
});

const authorizedUserUpdatedAction = (user: AuthorizedUserDTO) => ({
  type: ADMIN_CONSTANTS.AUTHORIZED_USER_UPDATED,
  payload: user
});
