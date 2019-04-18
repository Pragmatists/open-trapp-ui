import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { withWidth } from '@material-ui/core';
import { HeaderDesktop } from './components/header/Header.desktop';
import { HeaderMobile } from './components/header/Header.mobile';
import { Route, Switch } from 'react-router';
import { LandingPage } from './components/landingPage/LandingPage';
import { PrivateRoute } from './components/PrivateRoute';
import { NotFoundPage } from './components/notFound/NotFoundPage';
import React from 'react';
import { isWidthUp } from '@material-ui/core/withWidth';
import { RegistrationPageDesktop } from './components/registrationPage/RegistrationPage.desktop';
import { SettingsPageDesktop } from './components/settingsPage/SettingsPage.desktop';
import { RegistrationPageMobile } from './components/registrationPage/RegistrationPage.mobile';
import { SettingsPageMobile } from './components/settingsPage/SettingsPage.mobile';
import { ReportingPageDesktop } from './components/reportingPage/ReportingPage.desktop';
import { LeftMenu } from './components/leftMenu/LeftMenu';
import { redirectIfNeeded } from './components/redirectIfNeeded';
import { Notifications } from './components/notifications/Notifications';
import { ReportingPageMobile } from './components/reportingPage/ReportingPage.mobile';

interface AppRoutingProps {
  width: Breakpoint;
}

const AppRoutingComponent = ({width}: AppRoutingProps) => isWidthUp('md', width) ?
    <div>
      <HeaderDesktop/>
      <LeftMenu/>
      <Switch>
        <Route path='/' exact component={redirectIfNeeded(LandingPage)}/>
        <PrivateRoute path='/registration' component={RegistrationPageDesktop}/>
        <PrivateRoute path='/reporting' component={ReportingPageDesktop}/>
        <PrivateRoute path='/settings' component={SettingsPageDesktop}/>
        <Route component={NotFoundPage}/>
      </Switch>
      <Notifications />
    </div> :
    <div>
      <HeaderMobile/>
      <LeftMenu/>
      <Switch>
        <Route path='/' exact component={redirectIfNeeded(LandingPage)}/>
        <PrivateRoute path='/registration' component={RegistrationPageMobile}/>
        <PrivateRoute path='/reporting' component={ReportingPageMobile}/>
        <PrivateRoute path='/settings' component={SettingsPageMobile}/>
        <Route component={NotFoundPage}/>
      </Switch>
    </div>;

export const AppRouting = withWidth()(AppRoutingComponent);
