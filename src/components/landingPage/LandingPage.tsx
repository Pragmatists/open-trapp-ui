import React from 'react';
import Divider from '@material-ui/core/Divider';
import ScheduleIcon from '@material-ui/icons/Schedule';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PersonIcon from '@material-ui/icons/Person';
import { useLocation } from 'react-router-dom';
import './LandingPage.scss';
import { parse } from "querystring";
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { userLoggedInSelector } from '../../selectors/selectors';

const Card = ({title, text, icon}: { title: string, text: string, icon: JSX.Element }) => (
    <div className='landing-page-card card' data-testid='landing-page-card'>
      {icon}
      <h2 className='card__title'>{title}</h2>
      <Divider variant='middle' className='card__divider'/>
      <div className='card__text'>{text}</div>
    </div>
);

export const NotLoggedInLandingPage = () => (
    <div className='landing-page'>
      <div className='landing-page__header header'>
        <div className='header__content'>
          <h1>Welcome to OpenTrapp!</h1>
          <p>Capture your time into the simplest time registration application on the Internet.</p>
        </div>
      </div>
      <div className='landing-page__content content'>
        <Card title='Easy time capture'
              text='Powerful expression language will help you quickly register your work.'
              icon={<ScheduleIcon className='card__icon' color='primary'/>}/>
        <Card title='Intuitive reporting'
              text='Review your reports by applying different filters and enjoy the results in various presentation forms.'
              icon={<EqualizerIcon className='card__icon' color='primary'/>}/>
        <Card title='OpenID integration'
              text='No registration required. You can simply use your existing Gmail account to sign in.'
              icon={<PersonIcon className='card__icon' color='primary'/>}/>
      </div>
    </div>
);

export const LandingPage = () => {
  const isLoggedIn = useSelector(userLoggedInSelector);
  const location = useLocation();
  const params = parse(location.search.replace('?', ''));
  const redirect = params.redirect as string;
  if (redirect) {
    return <Redirect to={{pathname: redirect, state: {from: location}}}/>;
  } else if (isLoggedIn) {
    return <Redirect to={{pathname: '/registration', state: {from: location}}} />;
  }
  return (
      <NotLoggedInLandingPage/>
  );
};
