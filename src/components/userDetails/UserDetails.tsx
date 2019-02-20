import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import './UserDetails.scss';

interface UserDetailsProps {
  username: string;
  profilePicture: string;
  onLogout: () => void;
}

interface UserDetailsState {
  anchorEl: any;
}

export class UserDetails extends Component<UserDetailsProps, UserDetailsState> {
  state = {
    anchorEl: null,
  };

  render() {
    const {anchorEl} = this.state;
    const open = Boolean(anchorEl);
    const {username, profilePicture, onLogout} = this.props;
    return (
      <div className='user-details'>
        <div onClick={this.handleMenu} className='user-details__user user'>
          <Avatar alt={username}
                  src={profilePicture}/>
          <div className='user__name'>{username}</div>
        </div>
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
          <MenuItem>Settings</MenuItem>
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }

  private handleMenu = (event: { currentTarget: any; }) => {
    this.setState({anchorEl: event.currentTarget});
  };

  private handleClose = () => {
    this.setState({anchorEl: null});
  };
}
