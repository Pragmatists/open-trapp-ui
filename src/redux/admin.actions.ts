import { Dispatch } from 'redux';
import { OpenTrappRestAPI } from '../api/OpenTrappAPI';
import { ADMIN_CONSTANTS } from './constants';
import { ServiceAccountDTO } from '../api/dtos';

export function loadServiceAccounts() {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.serviceAccounts
        .then(serviceAccounts => dispatch(serviceAccountsLoadedAction(serviceAccounts)))
        .catch(err => console.error(err));
  };
}

const serviceAccountsLoadedAction = (serviceAccounts: ServiceAccountDTO[]) => ({
  type: ADMIN_CONSTANTS.SERVICE_ACCOUNTS_LOADED,
  payload: serviceAccounts
});
