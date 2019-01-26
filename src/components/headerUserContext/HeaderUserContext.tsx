import React, {Component} from 'react';
import {IconButton} from '@material-ui/core';
import {AccountCircle} from '@material-ui/icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

interface HeaderUserContextProps {
    auth?: any;
}

interface HeaderUserContextState {
    anchorEl: any;
}


export class HeaderUserContext extends Component<HeaderUserContextProps, HeaderUserContextState> {
    state = {
        anchorEl: null,
    };

    render() {
        const {auth} = this.props;
        return auth ? this.renderLoggedIn() : this.renderUnauthorized();
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
            <Button color='inherit' data-login-button>Login</Button>
        );
    }

    private handleMenu = (event: { currentTarget: any; }) => {
        this.setState({anchorEl: event.currentTarget});
    };

    private handleClose = () => {
        this.setState({anchorEl: null});
    };
}
