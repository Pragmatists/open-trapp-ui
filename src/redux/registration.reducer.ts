import { REGISTRATION_CONSTANTS } from './constants';

export interface RegistrationState {
  expression: string;
  tags: string[];
  days: string[];
  workload: string;
  valid: boolean;
}

const initialState: RegistrationState = {
  expression: '',
  tags: [],
  days: [],
  workload: '',
  valid: false
};

export function registration(state: RegistrationState = initialState, action) {
  switch (action.type) {
    case REGISTRATION_CONSTANTS.WORK_LOG_CHANGED:
      return {...action.payload};
    case REGISTRATION_CONSTANTS.WORK_LOG_SAVED:
      return initialState;
    default:
      return state;
  }
}