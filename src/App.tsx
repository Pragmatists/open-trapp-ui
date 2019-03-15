import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from "@material-ui/core";
import { Header } from "./components/header/Header";
import { theme } from "./theme";
import { LandingPage } from "./components/landingPage/LandingPage";
import { RegistrationPage } from "./components/registrationPage/RegistrationPage";
import { PrivateRoute } from './components/PrivateRoute';
import { SettingsPage } from './components/settingsPage/SettingsPage';
import { NotFoundPage } from './components/notFound/NotFoundPage';

export class App extends Component {
  render() {
    return (
      <Fragment>
        <CssBaseline/>
        <MuiThemeProvider theme={theme}>
          <BrowserRouter basename='/open-trapp-ui'>
            <div>
              <Header/>
              <Switch>
                <Route path='/' exact component={LandingPage}/>
                <PrivateRoute path='/registration' component={RegistrationPage}/>
                <PrivateRoute path='/settings' component={SettingsPage}/>
                <Route component={NotFoundPage}/>
              </Switch>
            </div>
          </BrowserRouter>
        </MuiThemeProvider>
      </Fragment>
    );
  }
}
