import React, { Component, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "./theme";
import { AppRouting } from './AppRouting';

export class App extends Component {
  render() {
    return (
      <Fragment>
        <CssBaseline/>
        <MuiThemeProvider theme={theme}>
          <BrowserRouter basename='/open-trapp-ui'>
            <AppRouting />
          </BrowserRouter>
        </MuiThemeProvider>
      </Fragment>
    );
  }
}
