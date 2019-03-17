import { LEFT_MENU_CONSTANTS } from './constants';

export interface LeftMenuState {
  open: boolean;
}

const initialState: () => LeftMenuState = () => ({
  open: false
});

export function leftMenu(state = initialState(), action) {
  switch (action.type) {
    case LEFT_MENU_CONSTANTS.VISIBILITY_CHANGE:
      return {open: !state.open};
    default:
      return state;
  }
}