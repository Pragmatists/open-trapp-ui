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

const monthLoadedAction = (month: MonthDTO) => ({
  type: CALENDAR_CONSTANTS.MONTH_LOADED,
  payload: month
});
