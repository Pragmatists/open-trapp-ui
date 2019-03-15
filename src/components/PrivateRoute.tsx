import { Redirect, Route } from 'react-router';
import React, { Component } from 'react';
import { LocalStorage } from '../utils/LocalStorage';

// @ts-ignore
export const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest}
         render={props => (LocalStorage.authorizedUser ?
             <Component {...props} /> :
             <Redirect to={{pathname: '/', state: {from: props.location}}}/>
         )}/>
);