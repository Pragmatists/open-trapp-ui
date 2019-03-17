import { Dispatch } from 'redux';
import { LEFT_MENU_CONSTANTS } from './constants';

export function toggleMenuVisibility() {
  return (dispatch: Dispatch) => dispatch(toggleMenuVisibilityAction());
}

const toggleMenuVisibilityAction = () => ({
  type: LEFT_MENU_CONSTANTS.VISIBILITY_CHANGE
});