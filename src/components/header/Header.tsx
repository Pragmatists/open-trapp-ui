import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Grid} from "@material-ui/core";
import ScheduleIcon from '@material-ui/icons/Schedule';
import {HeaderUserContext} from "../headerUserContext/HeaderUserContext";
import './Header.css'

export class Header extends Component<{}, {}> {
    render() {
        return (
            <div className='header'>
                <AppBar position="static">
                    <Grid container justify='center'>
                        <Grid item xs={12} sm={9}>
                            <Toolbar>
                                <ScheduleIcon className='header__icon' />
                                <Typography variant='h5' color='inherit' className='header__text'>
                                    Open<span>Trapp</span>
                                </Typography>
                                <HeaderUserContext auth={false}/>
                            </Toolbar>
                        </Grid>
                    </Grid>
                </AppBar>
            </div>
        );
    }
}
