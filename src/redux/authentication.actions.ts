import { Dispatch } from 'redux';
import { AUTHENTICATION_CONSTANTS } from './constants';
import { OpenTrappRestAPI } from '../api/OpenTrappAPI';
import { AuthorizedUser } from '../api/dtos';
import { LocalStorage } from '../utils/LocalStorage';

export function login(idToken: string, onSuccess: VoidFunction) {
  return (dispatch: Dispatch) => {
    dispatch(loginStartedAction());

    OpenTrappRestAPI.obtainJWTToken(idToken)
      .then(response => {
        LocalStorage.authorizedUser = response;
        return response;
      })
      .then(response => dispatch(loginSuccessAction(response)))
      .then(onSuccess)
      .catch(err => dispatch(loginFailedAction(err)));
  }
}

export function logout() {
  return (dispatch: Dispatch) => {
    LocalStorage.clearAuthorizedUser();
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
