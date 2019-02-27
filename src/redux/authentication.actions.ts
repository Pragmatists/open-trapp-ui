import { Dispatch } from 'redux';
import { AUTHENTICATION_CONSTANTS } from './constants';
import { OpenTrappRestAPI } from '../api/OpenTrappAPI';
import { AuthorizedUser } from '../api/dtos';

export function login(idToken: string, onSuccess: () => void) {
  return (dispatch: Dispatch) => {
    dispatch(loginStartedAction());

    OpenTrappRestAPI.obtainJWTToken(idToken)
      .then(response => {
        sessionStorage.setItem('OpenTrappUser', JSON.stringify(response));
        return response;
      })
      .then(response => dispatch(loginSuccessAction(response)))
      .then(onSuccess)
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
  payload: userDetails
});

const loginFailedAction = (error: Error) => ({
  type: AUTHENTICATION_CONSTANTS.LOGIN_FAILURE,
  payload: error
});

const logoutAction = () => ({
  type: AUTHENTICATION_CONSTANTS.LOGOUT
});
