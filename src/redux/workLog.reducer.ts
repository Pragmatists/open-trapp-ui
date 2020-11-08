import { ReportingWorkLogDTO } from '../api/dtos';
import { WORK_LOG_CONSTANTS } from '../actions/constants';

export interface WorkLogState {
  workLogs: ReportingWorkLogDTO[];
  tags: string[];
}

const initialState: WorkLogState = {
  workLogs: [],
  tags: []
};

export function workLog(state: WorkLogState = initialState, action: any): WorkLogState {
  switch (action.type) {
    case WORK_LOG_CONSTANTS.WORK_LOGS_LOADED:
      return {...state, workLogs: action.payload};
    case WORK_LOG_CONSTANTS.TAGS_LOADED:
      return {...state, tags: action.payload};
    case WORK_LOG_CONSTANTS.WORK_LOG_UPDATED:
      return {
        ...state,
        workLogs: state.workLogs.map(workLog => workLog.id === action.payload.id ? action.payload : workLog)
      };
    case WORK_LOG_CONSTANTS.WORK_LOG_REMOVED:
      return {
        ...state,
        workLogs: state.workLogs.filter(workLog => workLog.id !== action.payload)
      };
    default:
      return state;
  }
}
