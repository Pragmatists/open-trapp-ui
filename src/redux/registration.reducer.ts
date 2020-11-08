import {REGISTRATION_CONSTANTS} from '../actions/constants';
import {Preset} from '../components/registrationPage/registration.model';
import moment from 'moment';

interface WorkLogState {
  expression: string;
  tags: string[];
  days: string[];
  workload: string;
  valid: boolean;
}

export interface RegistrationState {
  workLog: WorkLogState;
  presets: Preset[];
}

export const initialState: (workLogState?: Partial<WorkLogState>) => RegistrationState = (workLogState) => ({
  workLog: {
    expression: '',
    tags: [],
    days: [moment().format('YYYY/MM/DD')],
    workload: '',
    valid: false,
    ...workLogState
  },
  presets: [],
});

export function registration(state: RegistrationState = initialState(), action): RegistrationState {
  switch (action.type) {
    case REGISTRATION_CONSTANTS.WORK_LOG_CHANGED:
      return {...state, workLog: action.payload};
    case REGISTRATION_CONSTANTS.WORK_LOG_SAVED:
      return {
        workLog: initialState({days: state.workLog.days}).workLog,
        presets: state.presets
      };
    case REGISTRATION_CONSTANTS.PRESETS_LOADED:
      return {...state, presets: action.payload};
    default:
      return state;
  }
}
