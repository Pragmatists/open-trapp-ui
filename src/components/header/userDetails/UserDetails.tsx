import React, { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import './UserDetails.scss';

interface Props {
  username: string;
  profilePicture: string;
  avatarOnly?: boolean;
  onLogout: VoidFunction;
}

export const UserDetails = ({username, profilePicture, avatarOnly, onLogout}: Props) => {
  const [anchorEl, setAnchorElement] = useState(null);
  const handleMenu = (event: { currentTarget: any; }) => setAnchorElement(event.currentTarget);
  const handleClose = () => setAnchorElement(null);

  const open = Boolean(anchorEl);
  return (
      <div className='user-details' data-testid='user-details'>
        <div onClick={handleMenu} className='user-details__user user'>
          <Avatar alt={username}
                  src={profilePicture}/>
          {!avatarOnly && <div className='user__name'>{username}</div>}
        </div>
        <Menu id='menu-appbar'
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={open}
              onClose={handleClose}>
          <MenuItem>Settings</MenuItem>
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
      </div>
  );
};
