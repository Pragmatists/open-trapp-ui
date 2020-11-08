import { ADMIN_CONSTANTS } from './constants';
import { AuthorizedUserDTO, ServiceAccountDTO } from '../api/dtos';

export const loadServiceAccountsAction = () => ({
  type: ADMIN_CONSTANTS.LOAD_SERVICE_ACCOUNTS
});

export const serviceAccountsLoadedAction = (serviceAccounts: ServiceAccountDTO[]) => ({
  type: ADMIN_CONSTANTS.SERVICE_ACCOUNTS_LOADED,
  payload: serviceAccounts
});

export const deleteServiceAccountAction = (id: string) => ({
  type: ADMIN_CONSTANTS.DELETE_SERVICE_ACCOUNT,
  payload: id
});

export type DeleteServiceAccountAction = ReturnType<typeof deleteServiceAccountAction>;

export const serviceAccountDeletedAction = (id: string) => ({
  type: ADMIN_CONSTANTS.SERVICE_ACCOUNT_DELETED,
  payload: id
});

export const loadAuthorizedUsersAction = () => ({
  type: ADMIN_CONSTANTS.LOAD_AUTHORIZED_USERS
});

export const authorizedUsersLoadedAction = (authorizedUsers: AuthorizedUserDTO[]) => ({
  type: ADMIN_CONSTANTS.AUTHORIZED_USERS_LOADED,
  payload: authorizedUsers
});
