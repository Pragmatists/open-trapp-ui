import { REPORTING_CONSTANTS } from './constants';

export enum ReportType {
  CALENDAR,
  TABLE
}

export interface ReportingState {
  selectedTags?: string[];
  selectedEmployees?: string[];
  reportType: ReportType;
}

export const initialState: () => ReportingState = () => ({
  reportType: ReportType.CALENDAR
});

export function reporting(state: ReportingState = initialState(), action) {
  switch (action.type) {
    case REPORTING_CONSTANTS.EMPLOYEES_SELECTION_CHANGED:
      return {...state, selectedEmployees: action.payload};
    case REPORTING_CONSTANTS.TAGS_SELECTION_CHANGED:
      return {...state, selectedTags: action.payload};
    case REPORTING_CONSTANTS.REPORT_TYPE_CHANGED:
      return {...state, reportType: action.payload};
    default:
      return state;
  }
}