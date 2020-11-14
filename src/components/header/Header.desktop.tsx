import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './Header.desktop.scss'
import openTrappIcon from '../../icons/openTrapp.svg';
import { UnauthorizedUser } from './UnauthorizedUser';
import { AuthorizedUser } from './AuthorizedUser';
import { userLoggedInSelector } from '../../selectors/selectors';
import { Tab, Tabs } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import BarChartIcon from '@material-ui/icons/BarChart';
import BuildIcon from '@material-ui/icons/Build';
import { OpenTrappState } from '../../redux/root.reducer';
import { includes } from 'lodash';

interface AppBarProps {
  path: string;
  onNavigate: (path: string) => void;
  showAdminPage: boolean;
}

const AppBarTabs = ({path, onNavigate, showAdminPage}: AppBarProps) => (
    <Tabs className='app-bar-tabs'
          data-testid='app-bar-tabs'
          value={path}
          onChange={(e, v) => onNavigate(v)}
          indicatorColor='primary'>
      <Tab icon={<CreateIcon/>} value='/registration' label='Registration'/>
      <Tab icon={<BarChartIcon/>} value='/reporting' label='Reporting'/>
      {showAdminPage && <Tab icon={<BuildIcon/>} value='/admin' label='Admin'/>}
    </Tabs>
);

export const HeaderDesktop = () => {
  const {pathname} = useLocation();
  const history = useHistory();
  const isLoggedIn = useSelector(userLoggedInSelector);
  const userRoles = useSelector((state: OpenTrappState) => state.authentication.user?.roles);

  const handleHeaderClicked = () => history.push('/');
  return (
      <AppBar position='sticky' color='secondary'>
        <div className='header-desktop'>
          <img src={openTrappIcon} alt='' className='header-desktop__logo' onClick={handleHeaderClicked}/>
          <Typography variant='h5' color='inherit' className='header-desktop__text' onClick={handleHeaderClicked}>
            Open<span>Trapp</span>
          </Typography>
          {isLoggedIn &&
          <AppBarTabs path={pathname} showAdminPage={includes(userRoles, 'ADMIN')} onNavigate={p => history.push(p)}/>}
          {isLoggedIn ? <AuthorizedUser/> : <UnauthorizedUser/>}
        </div>
      </AppBar>
  );
}
