import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import './header.css'
import {Grid} from "@material-ui/core";

export class Header extends Component<{}, {}> {
    render() {
        return (
            <div className='header'>
                <AppBar position="static">
                    <Grid container justify='center'>
                        <Grid item xs={9} sm={9}>
                            <Toolbar>
                                <Typography variant="h6" color="inherit">
                                    OpenTrapp
                                </Typography>
                            </Toolbar>
                        </Grid>
                    </Grid>
                </AppBar>
            </div>
        );
    }
}
