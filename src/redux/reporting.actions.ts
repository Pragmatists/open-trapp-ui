import { Dispatch } from 'redux';
import { REPORTING_CONSTANTS } from './constants';
import { ReportType } from './reporting.reducer';

export function changeTags(values: string[]) {
  return (dispatch: Dispatch) => dispatch(tagsChangedAction(values));
}

export function changeEmployees(values: string[]) {
  return (dispatch: Dispatch) => dispatch(employeesChangedAction(values));
}

export function changeReportType(type: ReportType) {
  return (dispatch: Dispatch) => dispatch(reportTypeChangeAction(type));
}

const tagsChangedAction = (values: string[]) => ({
  type: REPORTING_CONSTANTS.TAGS_SELECTION_CHANGED,
  payload: values
});

const employeesChangedAction = (values: string[]) => ({
  type: REPORTING_CONSTANTS.EMPLOYEES_SELECTION_CHANGED,
  payload: values
});

const reportTypeChangeAction = (type: ReportType) => ({
  type: REPORTING_CONSTANTS.REPORT_TYPE_CHANGED,
  payload: type
});