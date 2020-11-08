import { MonthDTO } from '../api/dtos';
import { CALENDAR_CONSTANTS } from './constants';

export const loadMonthAction = () => ({
  type: CALENDAR_CONSTANTS.LOAD_MONTH
});

export const monthChangedAction = (year: number, month: number) => ({
  type: CALENDAR_CONSTANTS.MONTH_CHANGED,
  payload: {year, month}
});

export type MonthChangedAction = ReturnType<typeof monthChangedAction>;

export const monthLoadedAction = (month: MonthDTO) => ({
  type: CALENDAR_CONSTANTS.MONTH_LOADED,
  payload: month
});
