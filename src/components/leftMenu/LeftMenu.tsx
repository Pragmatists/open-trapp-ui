import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { match, withRouter } from 'react-router';
import { History, Location } from 'history';
import { includes } from 'lodash';
import Drawer from '@material-ui/core/Drawer';
import { IconButton } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import CreateIcon from '@material-ui/icons/Create';
import CloseIcon from '@material-ui/icons/Close';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListIcon from '@material-ui/icons/List';
import BuildIcon from '@material-ui/icons/Build';
import { OpenTrappState } from '../../redux/root.reducer';
import { toggleMenuVisibility } from '../../redux/leftMenu.actions';
import './LeftMenu.scss';
import { LeftMenuEntry } from './LeftMenuEntry';

interface Props {
  history: History<any>;
  location: Location<any>;
  match: match<any>;
  mobileVersion?: boolean;
}

export const LeftMenuComponent = ({location, history, mobileVersion}: Props) => {
  const path = location.pathname;
  const open = useSelector((state: OpenTrappState) => state.leftMenu.open);
  const userLoggedIn = useSelector((state: OpenTrappState) => state.authentication.loggedIn);
  const userRoles = useSelector((state: OpenTrappState) => state.authentication.user?.roles);
  const dispatch = useDispatch();

  const onHideMenu = () => {
    dispatch(toggleMenuVisibility());
  };

  const showAdminPage = () => {
    return !mobileVersion && userLoggedIn && includes(userRoles, 'ADMIN');
  };

  const handleListItemClick = (path: string) => {
    history.push(path);
    onHideMenu();
  };

  return (
      <Drawer open={open}
              onClose={onHideMenu}
              className='left-menu'>
        <div className='left-menu__close-icon-container'>
          <IconButton onClick={onHideMenu} color='inherit' data-close-menu-button>
            <CloseIcon fontSize='large'/>
          </IconButton>
        </div>
        <Divider/>
        <List>
          <LeftMenuEntry label='Landing page'
                         selected={path === '/'}
                         icon={DashboardIcon}
                         onClick={() => handleListItemClick('/')}/>
          <LeftMenuEntry label='Registration'
                         selected={path === '/registration'}
                         disabled={!userLoggedIn}
                         icon={CreateIcon}
                         onClick={() => handleListItemClick('/registration')}/>
          <LeftMenuEntry label='Reporting'
                         selected={path === '/reporting'}
                         disabled={!userLoggedIn}
                         icon={ListIcon}
                         onClick={() => handleListItemClick('/reporting')}/>
          {
            showAdminPage() &&
            <LeftMenuEntry label='Admin'
                           selected={path === '/admin'}
                           icon={BuildIcon}
                           onClick={() => handleListItemClick('/admin')}/>
          }
        </List>
      </Drawer>
  );
};

export const LeftMenu = withRouter(LeftMenuComponent);
