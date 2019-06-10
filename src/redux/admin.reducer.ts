import { AuthorizedUserDTO, ServiceAccountDTO } from '../api/dtos';
import { ADMIN_CONSTANTS } from './constants';

export interface AdminState {
  serviceAccounts?: ServiceAccountDTO[];
  authorizedUsers?: AuthorizedUserDTO[];
}

const initialState: () => AdminState = () => ({});

export function admin(state = initialState(), action: any): AdminState {
  switch (action.type) {
    case ADMIN_CONSTANTS.SERVICE_ACCOUNTS_LOADED:
      return {...state, serviceAccounts: action.payload};
    case ADMIN_CONSTANTS.SERVICE_ACCOUNT_DELETED:
      return {
        ...state,
        serviceAccounts: state.serviceAccounts.filter(a => a.clientID !== action.payload)
      };
    case ADMIN_CONSTANTS.AUTHORIZED_USERS_LOADED:
      return {...state, authorizedUsers: action.payload};
    default:
      return state;
  }
}
