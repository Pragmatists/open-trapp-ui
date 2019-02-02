import React, {Component, Fragment} from 'react';
import {BrowserRouter, Route} from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import {MuiThemeProvider} from "@material-ui/core";
import {Header} from "./components/header/Header";
import {theme} from "./theme";
import './App.css';
import {LandingPage} from "./components/landingPage/LandingPage";
import {RegistrationPage} from "./components/registrationPage/RegistrationPage";
import { PrivateRoute } from './components/PrivateRoute';
import { SettingsPage } from './components/settingsPage/SettingsPage';

export class App extends Component {
    render() {
        return (
            <Fragment>
                <CssBaseline/>
                <MuiThemeProvider theme={theme}>
                    <BrowserRouter>
                        <div>
                            <Header/>
                            <Route path='/' exact component={LandingPage}/>
                            <Route path='/registration' component={RegistrationPage}/>
                            <PrivateRoute path='/settings' component={SettingsPage}/>
                        </div>
                    </BrowserRouter>
                </MuiThemeProvider>
            </Fragment>
        );
    }
}
