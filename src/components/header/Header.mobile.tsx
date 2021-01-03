import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import './Header.mobile.scss'
import { UnauthorizedUser } from './UnauthorizedUser';
import { AuthorizedUser } from './AuthorizedUser';
import { useHistory } from 'react-router-dom';
import { userLoggedInSelector } from '../../selectors/selectors';

export const HeaderMobile = () => {
  const history = useHistory();
  const isLoggedIn = useSelector(userLoggedInSelector);

  const handleHeaderClicked = () => history.push('/registration');

  return (
          <AppBar position='static' className='header-mobile' color='secondary'>
              <Typography variant='h5' color='inherit' className='header-mobile__header-text header-text' onClick={handleHeaderClicked}>
                Open<span>Trapp</span>
              </Typography>
            <div className='header-mobile__icon'>
              {isLoggedIn ? <AuthorizedUser avatarOnly={true} /> : <UnauthorizedUser buttonText='Sign in' />}
            </div>
          </AppBar>
    );
}
