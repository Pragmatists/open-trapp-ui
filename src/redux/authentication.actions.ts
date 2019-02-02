import { Dispatch } from 'redux';
import { AUTHENTICATION_CONSTANTS } from './constants';
import { OpenTrappAPI } from '../api/OpenTrappAPI';
import { AuthorizedUser } from '../api/dtos';

export function obtainJWTToken(idToken: string) {
  return (dispatch: Dispatch) => {
    dispatch(loginStartedAction());

    OpenTrappAPI.obtainJWTToken(idToken)
      .then(response => {
        sessionStorage.setItem('OpenTrappUser', JSON.stringify(response));
        return response;
      })
      .then(response => dispatch(loginSuccessAction(response)))
      .catch(err => dispatch(loginFailedAction(err)));
  }
}

export function logout() {
  return (dispatch: Dispatch) => {
    sessionStorage.removeItem('OpenTrappUser');
    dispatch(logoutAction());
  }
}

const loginStartedAction = () => ({
  type: AUTHENTICATION_CONSTANTS.LOGIN_REQUEST
});

const loginSuccessAction = (userDetails: AuthorizedUser) => ({
  type: AUTHENTICATION_CONSTANTS.LOGIN_SUCCESS,
  value: userDetails
});

const loginFailedAction = (error: Error) => ({
  type: AUTHENTICATION_CONSTANTS.LOGIN_FAILURE,
  value: error
});

const logoutAction = () => ({
  type: AUTHENTICATION_CONSTANTS.LOGOUT
});