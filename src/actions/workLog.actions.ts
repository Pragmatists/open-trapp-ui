import { REGISTRATION_CONSTANTS, WORK_LOG_CONSTANTS } from './constants';
import { BulkEditDTO, ReportingWorkLogDTO } from '../api/dtos';
import { ParsedWorkLog } from '../workLogExpressionParser/ParsedWorkLog';

export const loadWorkLogsAction = (year: number, month: number) => ({
  type: WORK_LOG_CONSTANTS.LOAD_WORK_LOGS,
  payload: {year, month}
});

export const workLogLoadedAction = entries => ({
  type: WORK_LOG_CONSTANTS.WORK_LOGS_LOADED,
  payload: entries
});

export const loadTagsAction = (numberOfPastMonths?: number) => ({
  type: WORK_LOG_CONSTANTS.LOAD_TAGS,
  payload: numberOfPastMonths
});

export const tagsLoadedAction = tags => ({
  type: WORK_LOG_CONSTANTS.TAGS_LOADED,
  payload: tags
});

export const updateWorkLogAction = (id: string, tags: string[], workload: string) => ({
  type: WORK_LOG_CONSTANTS.UPDATE_WORK_LOG,
  payload: {id, tags, workload}
});

export const workLogUpdatedAction = (workLog: ReportingWorkLogDTO) => ({
  type: WORK_LOG_CONSTANTS.WORK_LOG_UPDATED,
  payload: workLog
});

export const removeWorkLogAction = (id: string) => ({
  type: WORK_LOG_CONSTANTS.REMOVE_WORK_LOG,
  payload: id
});

export const workLogRemovedAction = (id: string) => ({
  type: WORK_LOG_CONSTANTS.WORK_LOG_REMOVED,
  payload: id
});

export const bulkEditAction = (editDto: BulkEditDTO) => ({
  type: WORK_LOG_CONSTANTS.BULK_EDIT_REQUEST,
  payload: editDto
});

export const bulkEditDoneAction = () => ({
  type: WORK_LOG_CONSTANTS.BULK_EDIT_DONE
});

export const workLogChangedAction = (workLog: ParsedWorkLog) => ({
  type: REGISTRATION_CONSTANTS.WORK_LOG_CHANGED,
  payload: {
    days: workLog.days,
    tags: workLog.tags,
    workload: workLog.workload,
    expression: workLog.expression,
    valid: workLog.validate().valid
  }
});

export const saveWorkLogAction = (workLog: ParsedWorkLog) => ({
  type: WORK_LOG_CONSTANTS.SAVE_WORK_LOG,
  payload: workLog
});

export const workLogSavedAction = () => ({
  type: REGISTRATION_CONSTANTS.WORK_LOG_SAVED
});
