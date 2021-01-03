import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
import { loginFailedAction, loginSuccessAction } from '../../actions/authentication.actions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { LocalStorage } from '../../utils/LocalStorage';

export const UnauthorizedUser = ({buttonText}: {buttonText?: string}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const handleSuccessLogin = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const idToken = (response as GoogleLoginResponse).getAuthResponse().id_token;
    OpenTrappRestAPI.obtainJWTToken(idToken)
        .then(u => {
          LocalStorage.authorizedUser = u;
          return u;
        })
        .then(u => dispatch(loginSuccessAction(u)))
        .then(_ => history.push('/registration'))
        .catch(e => dispatch(loginFailedAction(e)));
  };

  return (
      <GoogleLogin
          clientId='522512788382-la0g5vpsf2q8anekstsh2l551m1ba4oe.apps.googleusercontent.com'
          responseType='id_token'
          buttonText={buttonText}
          onSuccess={handleSuccessLogin}
          onFailure={e => console.error('Google login failed', e)}
      />
  )
}
