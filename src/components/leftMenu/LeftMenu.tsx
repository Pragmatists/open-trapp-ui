import React, { Component } from 'react';
import { connect } from 'react-redux';
import { match, withRouter } from 'react-router';
import { History, Location } from 'history';
import { includes } from 'lodash';
import Drawer from '@material-ui/core/Drawer';
import { IconButton } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import CloseIcon from '@material-ui/icons/Close';
import { OpenTrappState } from '../../redux/root.reducer';
import { toggleMenuVisibility } from '../../redux/leftMenu.actions';
import { AuthorizedUser } from '../../api/dtos';
import './LeftMenu.scss';
import { LeftMenuEntry } from './LeftMenuEntry';

interface OwnProps {
  history: History<any>;
  location: Location<any>;
  match: match<any>;
  mobileVersion?: boolean;
}

interface DataProps {
  open: boolean;
  userLoggedIn: boolean;
  userRoles: string[];
}

interface EventProps {
  onHideMenu: VoidFunction;
}

type Props = DataProps & OwnProps & EventProps;

export class LeftMenuComponent extends Component<Props, {}> {
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
            <LeftMenuEntry label='Landing page'
                           selected={path === '/'}
                           onClick={() => this.handleListItemClick('/')}/>
            <LeftMenuEntry label='Registration'
                           selected={path === '/registration'}
                           disabled={!userLoggedIn}
                           onClick={() => this.handleListItemClick('/registration')}/>
            <LeftMenuEntry label='Reporting'
                           selected={path === '/reporting'}
                           disabled={!userLoggedIn}
                           onClick={() => this.handleListItemClick('/reporting')}/>
            {
              this.showAdminPage &&
              <LeftMenuEntry label='Admin'
                             selected={path === '/admin'}
                             onClick={() => this.handleListItemClick('/admin')}/>
            }
          </List>
        </Drawer>
    );
  }

  private handleListItemClick(path: string) {
    const {history, onHideMenu} = this.props;
    history.push(path);
    onHideMenu();
  }

  private get showAdminPage() {
    const {userLoggedIn, userRoles, mobileVersion} = this.props;
    return !mobileVersion && userLoggedIn && includes(userRoles, 'ADMIN');
  }
}

export function mapStateToProps(state: OpenTrappState, ownProps: OwnProps): DataProps & OwnProps {
  const {open} = state.leftMenu;
  const {loggedIn, user = {} as AuthorizedUser} = state.authentication;
  return {
    open,
    userLoggedIn: loggedIn,
    userRoles: user.roles,
    ...ownProps
  };
}

function mapDispatchToProps(dispatch): EventProps {
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
