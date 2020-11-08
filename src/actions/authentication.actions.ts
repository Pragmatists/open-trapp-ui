import { AUTHENTICATION_CONSTANTS } from './constants';
import { AuthorizedUser } from '../api/dtos';

export const loginSuccessAction = (userDetails: AuthorizedUser) => ({
  type: AUTHENTICATION_CONSTANTS.LOGIN_SUCCESS,
  payload: userDetails
});

export const loginFailedAction = (error: Error) => ({
  type: AUTHENTICATION_CONSTANTS.LOGIN_FAILURE,
  payload: error
});

export const logoutAction = () => ({
  type: AUTHENTICATION_CONSTANTS.LOGOUT
});
