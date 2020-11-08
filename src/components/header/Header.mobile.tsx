import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import IconButton from '@material-ui/core/IconButton';
import { toggleMenuVisibilityAction } from '../../actions/leftMenu.actions';
import './Header.mobile.scss'
import { UnauthorizedUser } from './UnauthorizedUser';
import { AuthorizedUser } from './AuthorizedUser';
import { useHistory } from 'react-router-dom';
import { userLoggedInSelector } from '../../selectors/selectors';

export const HeaderComponent = () => {
  const history = useHistory();
  const isLoggedIn = useSelector(userLoggedInSelector);
  const dispatch = useDispatch();

  const handleHeaderClicked = () => history.push('/registration');

  return (
          <AppBar position='static' className='header-mobile' color='secondary'>
              <IconButton color='inherit' aria-label='Menu' onClick={() => dispatch(toggleMenuVisibilityAction())}>
                <MenuIcon fontSize='large'/>
              </IconButton>
              <Typography variant='h5' color='inherit' className='header-mobile__text' onClick={handleHeaderClicked}>
                Open<span>Trapp</span>
              </Typography>
            <div className='header-mobile__icon'>
              {isLoggedIn ? <AuthorizedUser avatarOnly={true} /> : <UnauthorizedUser buttonText='Sign in' />}
            </div>
          </AppBar>
    );
}

export const HeaderMobile = withRouter(HeaderComponent);
