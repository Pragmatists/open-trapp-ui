import { REGISTRATION_CONSTANTS } from './constants';
import { Preset } from '../components/registrationPage/registration.model';

export interface RegistrationState {
  workLog: {
    expression: string;
    tags: string[];
    days: string[];
    workload: string;
    valid: boolean;
  },
  presets: Preset[]
}

export const initialState: () => RegistrationState = () => ({
  workLog: {
    expression: '',
    tags: [],
    days: [],
    workload: '',
    valid: false
  },
  presets: []
});

export function registration(state: RegistrationState = initialState(), action): RegistrationState {
  switch (action.type) {
    case REGISTRATION_CONSTANTS.WORK_LOG_CHANGED:
      return {...state, workLog: action.payload};
    case REGISTRATION_CONSTANTS.WORK_LOG_SAVED:
      return initialState();
    case REGISTRATION_CONSTANTS.PRESET_CREATED:
      return {...state, presets: [action.payload, ...state.presets]};
    case REGISTRATION_CONSTANTS.PRESET_REMOVED:
      return {...state, presets: state.presets.filter(p => p.id !== action.payload.id)};
    default:
      return state;
  }
}
