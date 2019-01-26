import React, {Component, Fragment} from 'react';
import {BrowserRouter, Route} from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import {MuiThemeProvider} from "@material-ui/core";
import {Header} from "./components/header/header";
import {theme} from "./theme";
import './App.css';
import {LandingPage} from "./components/landing-page/landing-page";
import {RegistrationPage} from "./components/registration-page/registration-page";

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
                        </div>
                    </BrowserRouter>
                </MuiThemeProvider>
            </Fragment>
        );
    }
}
