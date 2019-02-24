import { ReportingWorkLogDTO } from '../api/dtos';
import { WORK_LOG_CONSTANTS } from './constants';

export interface WorkLogState {
  workLogs?: ReportingWorkLogDTO[];
}

const initialState: WorkLogState = {
  workLogs: undefined
};

export function workLog(state: WorkLogState = initialState, action: any): WorkLogState {
  switch (action.type) {
    case WORK_LOG_CONSTANTS.WORK_LOG_LOADED:
      return {...state, workLogs: action.payload};
    default:
      return state;
  }
}
