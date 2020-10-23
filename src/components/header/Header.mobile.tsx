import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { OpenTrappState } from '../../redux/root.reducer';
import { logout, login } from '../../redux/authentication.actions';
import { UserDetails } from '../userDetails/UserDetails';
import { withRouter } from 'react-router';
import IconButton from '@material-ui/core/IconButton';
import { toggleMenuVisibility } from '../../redux/leftMenu.actions';
import './Header.mobile.scss'

interface HeaderDataProps {
  isLoggedIn: boolean;
  username?: string;
  profilePicture?: string;
  history?: any;
}

interface HeaderEventProps {
  onGoogleToken: (token: string, onSuccess: VoidFunction) => void;
  onLogout: VoidFunction;
  onMenuButtonClick: VoidFunction;
}

type HeaderProps = HeaderDataProps & HeaderEventProps;

export class HeaderComponent extends Component<HeaderProps, {}> {
  render() {
    const {isLoggedIn, onMenuButtonClick} = this.props;
    return (
          <AppBar position='static' className='header-mobile' color='secondary'>
              <IconButton color='inherit' aria-label='Menu' onClick={onMenuButtonClick} data-left-menu-button >
                <MenuIcon fontSize='large'/>
              </IconButton>
              <Typography variant='h5' color='inherit' className='header-mobile__text' onClick={this.handleHeaderClicked}>
                Open<span>Trapp</span>
              </Typography>
            <div className='header-mobile__icon'>
              {isLoggedIn ? this.renderAuthorized() : this.renderUnauthorized()}
            </div>
          </AppBar>
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
    const {onLogout, username = '', profilePicture = '', history} = this.props;
    const logoutAndRedirect = () => {
      onLogout();
      history.push('/');
    };
    return <UserDetails onLogout={logoutAndRedirect}
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
    console.error('handleErrorLogin', response);
  };

  private handleHeaderClicked = () => {
    const {history} = this.props;
    history.push('/registration');
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
