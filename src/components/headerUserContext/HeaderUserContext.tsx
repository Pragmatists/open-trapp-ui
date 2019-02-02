import React, { Component } from 'react';
import { IconButton } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { OpenTrappState } from '../../redux/root.reducer';
import { connect } from 'react-redux';
import { logout, obtainJWTToken } from '../../redux/authentication.actions';

interface HeaderUserContextDataProps {
  isLoggedIn: boolean;
  username?: string;
}

interface HeaderUserContextEventProps {
  onGoogleToken: (token: string) => void;
  onLogout: () => void;
}

type HeaderUserContextProps = HeaderUserContextDataProps & HeaderUserContextEventProps;

interface HeaderUserContextState {
  anchorEl: any;
}


class HeaderUserContextComponent extends Component<HeaderUserContextProps, HeaderUserContextState> {
  state = {
    anchorEl: null,
  };

  render() {
    const {isLoggedIn} = this.props;
    return isLoggedIn ? this.renderLoggedIn() : this.renderUnauthorized();
  }

  private renderLoggedIn() {
    const {anchorEl} = this.state;
    const open = Boolean(anchorEl);
    return (
      <div>
        <IconButton aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup='true'
                    onClick={this.handleMenu}
                    color='inherit'
                    data-user-icon>
          <AccountCircle/>
        </IconButton>
        <Menu id='menu-appbar'
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={this.handleClose}>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Logout</MenuItem>
        </Menu>
      </div>
    );
  }

  private renderUnauthorized() {
    return (
      <GoogleLogin
        clientId='522512788382-la0g5vpsf2q8anekstsh2l551m1ba4oe.apps.googleusercontent.com'
        responseType='id_token'
        onSuccess={this.handleSuccessLogin}
        onFailure={this.handleErrorLogin}
      />
    );
  }

  private handleMenu = (event: { currentTarget: any; }) => {
    this.setState({anchorEl: event.currentTarget});
  };

  private handleClose = () => {
    this.setState({anchorEl: null});
  };

  private handleSuccessLogin = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const {onGoogleToken} = this.props;
    const idToken = (response as GoogleLoginResponse).getAuthResponse().id_token;
    onGoogleToken(idToken);
  };

  private handleErrorLogin = (response: any) => {
    console.log('handleErrorLogin', response);
  };
}

function mapStateToProps(state: OpenTrappState): HeaderUserContextDataProps {
  const {loggedIn, user} = state.authentication;
  return {
    isLoggedIn: loggedIn,
    username: user ? user.displayName : undefined
  };
}

function mapDispatchToProps(dispatch: any): HeaderUserContextEventProps {
  return {
    onGoogleToken: token => dispatch(obtainJWTToken(token)),
    onLogout: () => dispatch(logout())
  };
}

export const HeaderUserContext = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderUserContextComponent);
