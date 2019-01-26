import React, {Component} from 'react';
import './landing-page.css'
import {Grid} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import ScheduleIcon from '@material-ui/icons/Schedule';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PersonIcon from '@material-ui/icons/Person';

export class LandingPage extends Component<{}, {}> {

    render() {
        return (
            <div className='landing-page'>
                <Grid container spacing={24}>
                    <Grid item container justify='center' xs={12} className='landing-page__header header'>
                        <Grid item xs={9} sm={9} className='header__content'>
                            <h1>Welcome to OpenTrapp!</h1>
                            <p>Capture your time into the simplest time registration application on the
                                Internet.</p>
                        </Grid>
                    </Grid>
                    <Grid item container justify='center' xs={12}>
                        <Grid item xs={9} sm={3} className='landing-page-card card'>
                            <ScheduleIcon className='card__icon'/>
                            <h2 className='card__title'>Easy time capture</h2>
                            <Divider variant='middle' className='card__divider'/>
                            <div className='card__text'>
                                Powerfull expression language will help you quickly register your work.
                            </div>
                        </Grid>
                        <Grid item xs={9} sm={3} className='landing-page-card card'>
                            <EqualizerIcon className='card__icon'/>
                            <h2 className='card__title'>Intuitive reporting</h2>
                            <Divider variant='middle' className='card__divider'/>
                            <div className='card__text'>
                                Review your reports by applying different filters and enjoy the results in various presentation forms.
                            </div>
                        </Grid>
                        <Grid item xs={9} sm={3} className='landing-page-card card'>
                            <PersonIcon className='card__icon'/>
                            <h2 className='card__title'>OpenID integration</h2>
                            <Divider variant='middle' className='card__divider'/>
                            <div className='card__text'>
                                No registration required. You can simply use your existing Gmail account to sign in.
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
