import { Redirect, Route } from 'react-router';
import React, { Component } from 'react';

// @ts-ignore
export const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest}
         render={props => (localStorage.getItem('user') ?
             <Component {...props} /> :
             <Redirect to={{pathname: '/', state: {from: props.location}}}/>
         )}/>
);