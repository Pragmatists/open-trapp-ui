import { ServiceAccountDTO } from '../api/dtos';
import { ADMIN_CONSTANTS } from './constants';

export interface AdminState {
  serviceAccounts?: ServiceAccountDTO[];
}

const initialState: () => AdminState = () => ({});

export function admin(state = initialState(), action: any): AdminState {
  switch (action.type) {
    case ADMIN_CONSTANTS.SERVICE_ACCOUNTS_LOADED:
      return {...state, serviceAccounts: action.payload};
    default:
      return state;
  }
}
