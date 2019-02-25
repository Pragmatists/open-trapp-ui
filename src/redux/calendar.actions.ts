import { Dispatch } from 'redux';
import { OpenTrappRestAPI } from '../api/OpenTrappAPI';
import { MonthDTO } from '../api/dtos';
import { CALENDAR_CONSTANTS } from './constants';

export function loadMonth(year: number, month: number) {
  return (dispatch: Dispatch) => {
    OpenTrappRestAPI.calendarMonth(year, month)
        .then(month => dispatch(monthLoadedAction(month)))
        .catch(err => console.error(err))
  };
}

export function changeMonth(year: number, month: number) {
  return (dispatch: Dispatch) => {
    dispatch(monthChagedAction(year, month));
    OpenTrappRestAPI.calendarMonth(year, month)
        .then(month => dispatch(monthLoadedAction(month)))
        .catch(err => console.error(err))
  };
}

const monthChagedAction = (year: number, month: number) => ({
  type: CALENDAR_CONSTANTS.MONTH_CHANGED,
  payload: {year, month}
});

const monthLoadedAction = (month: MonthDTO) => ({
  type: CALENDAR_CONSTANTS.MONTH_LOADED,
  payload: month
});
