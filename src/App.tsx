import { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "./theme";
import { AppRouting } from './AppRouting';

export const App = () => (
    <Fragment>
      <CssBaseline/>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter basename='/'>
          <AppRouting/>
        </BrowserRouter>
      </MuiThemeProvider>
    </Fragment>
);

