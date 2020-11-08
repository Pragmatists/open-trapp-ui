import React from 'react';
import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import ScheduleIcon from '@material-ui/icons/Schedule';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PersonIcon from '@material-ui/icons/Person';
import './LandingPage.scss';

const Card = ({title, text, icon}: { title: string, text: string, icon: JSX.Element }) => (
    <Grid item xs={9} md={3} className='landing-page-card card' data-testid='landing-page-card'>
      {icon}
      <h2 className='card__title'>{title}</h2>
      <Divider variant='middle' className='card__divider'/>
      <div className='card__text'>{text}</div>
    </Grid>
);

export const LandingPage = () => (
    <div className='landing-page'>
      <Grid container spacing={3}>
        <Grid item container justify='center' xs={12} className='landing-page__header header'>
          <Grid item xs={9} className='header__content'>
            <h1>Welcome to OpenTrapp!</h1>
            <p>Capture your time into the simplest time registration application on the Internet.</p>
          </Grid>
        </Grid>
        <Grid item container justify='center' xs={12}>
          <Card title='Easy time capture'
                text='Powerful expression language will help you quickly register your work.'
                icon={<ScheduleIcon className='card__icon' color='primary'/>}/>
          <Card title='Intuitive reporting'
                text='Review your reports by applying different filters and enjoy the results in various presentation forms.'
                icon={<EqualizerIcon className='card__icon' color='primary'/>}/>
          <Card title='OpenID integration'
                text='No registration required. You can simply use your existing Gmail account to sign in.'
                icon={<PersonIcon className='card__icon' color='primary'/>}/>
        </Grid>
      </Grid>
    </div>
);
