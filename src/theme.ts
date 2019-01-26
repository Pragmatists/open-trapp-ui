import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#f5f5f5',
        },
        secondary: {
            main: '#2d6ca2',
        },
    },
    typography: {
        useNextVariants: true,
    }
});
