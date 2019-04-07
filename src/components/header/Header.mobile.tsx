import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { OpenTrappState } from '../../redux/root.reducer';
import { logout, login } from '../../redux/authentication.actions';
import './Header.mobile.scss'
import { UserDetails } from '../userDetails/UserDetails';
import { withRouter } from 'react-router';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import { toggleMenuVisibility } from '../../redux/leftMenu.actions';

interface HeaderDataProps {
  isLoggedIn: boolean;
  username?: string;
  profilePicture?: string;
  history?: any;
}

interface HeaderEventProps {
  onGoogleToken: (token: string, onSuccess: () => void) => void;
  onLogout: () => void;
  onMenuButtonClick: () => void;
}

type HeaderProps = HeaderDataProps & HeaderEventProps;

export class HeaderComponent extends Component<HeaderProps, {}> {
  render() {
    const {isLoggedIn, history, onMenuButtonClick} = this.props;
    return (
        <div className='header'>
          <AppBar position='static'>
            <Grid container justify='center'>
              <Grid item xs={1} className='header__hamburger-container'>
                <IconButton color='inherit' aria-label='Menu' onClick={onMenuButtonClick} data-left-menu-button>
                  <MenuIcon fontSize='large'/>
                </IconButton>
              </Grid>
              <Grid item xs={11}>
                <Toolbar>
                  <Typography variant='h5' color='inherit' className='header__text' onClick={() => history.push('/')}>
                    Open<span>Trapp</span>
                  </Typography>
                  {isLoggedIn ? this.renderAuthorized() : this.renderUnauthorized()}
                </Toolbar>
              </Grid>
            </Grid>
          </AppBar>
        </div>
    );
  }

  private renderUnauthorized() {
    return (
        <GoogleLogin
            clientId='522512788382-la0g5vpsf2q8anekstsh2l551m1ba4oe.apps.googleusercontent.com'
            responseType='id_token'
            buttonText='Sign in'
            onSuccess={this.handleSuccessLogin}
            onFailure={this.handleErrorLogin}
        />
    );
  }

  private renderAuthorized() {
    const {onLogout, username = '', profilePicture = ''} = this.props;
    return <UserDetails onLogout={onLogout}
                        username={username}
                        avatarOnly={true}
                        profilePicture={profilePicture}/>;
  }

  private handleSuccessLogin = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const {onGoogleToken, history} = this.props;
    const idToken = (response as GoogleLoginResponse).getAuthResponse().id_token;
    onGoogleToken(idToken, () => history.push('/registration'));
  };

  private handleErrorLogin = (response: any) => {
    console.log('handleErrorLogin', response);
  };
}

function mapStateToProps(state: OpenTrappState): HeaderDataProps {
  const {loggedIn, user} = state.authentication;
  return {
    isLoggedIn: loggedIn,
    username: user ? user.displayName : undefined,
    profilePicture: user ? user.profilePicture : undefined
  };
}

function mapDispatchToProps(dispatch: any): HeaderEventProps {
  return {
    onGoogleToken: (token, onSuccess) => dispatch(login(token, onSuccess)),
    onLogout: () => dispatch(logout()),
    onMenuButtonClick: () => dispatch(toggleMenuVisibility())
  };
}

export const HeaderMobile = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(HeaderComponent) as any);