import React, {Component} from 'react';
import {Grid} from "@material-ui/core";
import './RegistrationPage.desktop.css'
import Divider from "@material-ui/core/Divider";
import {WorkLogInput} from "../workLogInput/WorkLogInput";

export class RegistrationPageDesktop extends Component<{}, {}> {
    render() {
        return (
            <div className='registration-page'>
                <Grid container justify='center' xs={12} spacing={24}>
                    <Grid item xs={8}>
                        <div className='registration-page__header'>
                            <span>Report your time</span> using our expression language, to make it quick!
                        </div>
                        <Divider variant='fullWidth'/>
                    </Grid>
                    <Grid item xs={8}>
                        <WorkLogInput/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
