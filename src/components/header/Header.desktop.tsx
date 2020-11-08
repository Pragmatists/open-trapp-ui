import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './Header.desktop.scss'
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import { toggleMenuVisibilityAction } from '../../actions/leftMenu.actions';
import openTrappIcon from '../../icons/openTrapp.svg';
import { UnauthorizedUser } from './UnauthorizedUser';
import { AuthorizedUser } from './AuthorizedUser';
import { userLoggedInSelector } from '../../selectors/selectors';

export const HeaderDesktop = () => {
  const history = useHistory();
  const isLoggedIn = useSelector(userLoggedInSelector);
  const dispatch = useDispatch();

  const handleHeaderClicked = () => history.push('/registration');

  return (
        <div className='header-desktop'>
          <AppBar position='static' color='secondary'>
            <Grid container justify='center'>
              <Grid item xs={1} className='header-desktop__hamburger-container'>
                <IconButton color='inherit' aria-label='Menu' onClick={() => dispatch(toggleMenuVisibilityAction())}>
                  <MenuIcon fontSize='large'/>
                </IconButton>
              </Grid>
              <Grid item xs={11} lg={10}>
                <Toolbar>
                  <img src={openTrappIcon} alt='' className='header-desktop__logo' onClick={handleHeaderClicked} />
                  <Typography variant='h5' color='inherit' className='header-desktop__text' onClick={handleHeaderClicked}>
                    Open<span>Trapp</span>
                  </Typography>
                  {isLoggedIn ? <AuthorizedUser /> : <UnauthorizedUser />}
                </Toolbar>
              </Grid>
              <Hidden mdDown>
                <Grid item xs='auto' lg={1}/>
              </Hidden>
            </Grid>
          </AppBar>
        </div>
    );
}
