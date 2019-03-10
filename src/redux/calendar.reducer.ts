import moment from 'moment';
import { CALENDAR_CONSTANTS } from './constants';
import { DayDTO } from '../api/dtos';

export interface CalendarState {
  selectedMonth: {
    year: number;
    month: number;
  };
  days?: DayDTO[];
}

const initialState: CalendarState = {
  selectedMonth: {
    year: moment().year(),
    month: moment().month() + 1
  },
};

export function calendar(state: CalendarState = initialState, action: any): CalendarState {
  switch (action.type) {
    case CALENDAR_CONSTANTS.MONTH_LOADED:
      return {...state, days: action.payload.days};
    case CALENDAR_CONSTANTS.MONTH_CHANGED:
      return {...state, selectedMonth: {year: action.payload.year, month: action.payload.month}, days: undefined};
    default:
      return state;
  }
}
