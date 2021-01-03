import { logoutAction } from '../../actions/authentication.actions';
import { UserDetails } from './userDetails/UserDetails';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { OpenTrappState } from '../../redux/root.reducer';
import { LocalStorage } from '../../utils/LocalStorage';

export const AuthorizedUser = ({avatarOnly}: {avatarOnly?: boolean}) => {
  const username = useSelector((s: OpenTrappState) => s.authentication.user?.displayName);
  const profilePicture = useSelector((s: OpenTrappState) => s.authentication.user?.profilePicture);
  const dispatch = useDispatch();
  const history = useHistory();
  const logoutAndRedirect = () => {
    LocalStorage.clearAuthorizedUser();
    dispatch(logoutAction());
    history.push('/');
  };
  return (
      <UserDetails onLogout={logoutAndRedirect}
                   avatarOnly={avatarOnly}
                   username={username}
                   profilePicture={profilePicture}/>
  );
}
