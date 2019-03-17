import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { match, withRouter } from 'react-router';
import { History, Location } from 'history';
import { IconButton } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CreateIcon from '@material-ui/icons/Create';
import CloseIcon from '@material-ui/icons/Close';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListIcon from '@material-ui/icons/List';
import { OpenTrappState } from '../../redux/root.reducer';
import { toggleMenuVisibility } from '../../redux/leftMenu.actions';
import { connect } from 'react-redux';
import './LeftMenu.scss';

interface LeftMenuOwnProps {
  history: History<any>;
  location: Location<any>;
  match: match<any>;
}

interface LeftMenuDataProps {
  open: boolean;
  userLoggedIn: boolean;
}

interface LeftMenuEventProps {
  onHideMenu: () => void;
}

type LeftMenuProps = LeftMenuDataProps & LeftMenuOwnProps & LeftMenuEventProps;

class LeftMenuComponent extends Component<LeftMenuProps, {}> {
  render() {
    const {open, onHideMenu, location, userLoggedIn} = this.props;
    const path = location.pathname;
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
            <ListItem button
                      selected={path === '/'}
                      onClick={() => this.handleListItemClick('/')}>
              <ListItemIcon>
                <DashboardIcon color='secondary'/>
              </ListItemIcon>
              <ListItemText primary='Landing page'/>
            </ListItem>
            <ListItem button
                      selected={path === '/registration'}
                      disabled={!userLoggedIn}
                      onClick={() => this.handleListItemClick('/registration')}>
              <ListItemIcon>
                <CreateIcon color='secondary'/>
              </ListItemIcon>
              <ListItemText primary='Registration'/>
            </ListItem>
            <ListItem button
                      disabled={!userLoggedIn}
                      selected={path === '/reporting'}
                      onClick={() => this.handleListItemClick('/reporting')}>
              <ListItemIcon>
                <ListIcon color='secondary'/>
              </ListItemIcon>
              <ListItemText primary='Reporting'/>
            </ListItem>
          </List>
        </Drawer>
    );
  }

  private handleListItemClick(path: string) {
    const {history} = this.props;
    history.push(path);
  }
}

function mapStateToProps(state: OpenTrappState, ownProps: LeftMenuOwnProps): LeftMenuDataProps {
  const {open} = state.leftMenu;
  const {loggedIn} = state.authentication;
  return {
    open,
    userLoggedIn: loggedIn,
    ...ownProps
  };
}

function mapDispatchToProps(dispatch): LeftMenuEventProps {
  return {
    onHideMenu() {
      dispatch(toggleMenuVisibility());
    }
  };
}

export const LeftMenu = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(LeftMenuComponent)
);
