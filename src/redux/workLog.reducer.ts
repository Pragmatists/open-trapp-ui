import { ReportingWorkLogDTO } from '../api/dtos';
import { WORK_LOG_CONSTANTS } from './constants';

export interface WorkLogState {
  workLogs?: ReportingWorkLogDTO[];
  tags?: string[];
}

const initialState: WorkLogState = {
  workLogs: undefined,
  tags: undefined
};

export function workLog(state: WorkLogState = initialState, action: any): WorkLogState {
  switch (action.type) {
    case WORK_LOG_CONSTANTS.WORK_LOG_LOADED:
      return {...state, workLogs: action.payload};
    case WORK_LOG_CONSTANTS.TAGS_LOADED:
      return {...state, tags: action.payload};
    default:
      return state;
  }
}
