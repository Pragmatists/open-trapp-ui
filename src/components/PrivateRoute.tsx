import { Redirect, Route } from 'react-router';
import React, { Component } from 'react';
import { LocalStorage } from '../utils/LocalStorage';

export const PrivateRoute = ({...props}) => (
  <Route {...props}
         render={props => (LocalStorage.authorizedUser ?
             <Component {...props} /> :
             <Redirect to={{pathname: '/', state: {from: props.location}}}/>
         )}/>
);
