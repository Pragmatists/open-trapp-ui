import { Redirect, Route } from 'react-router';
import React, { Component, FC } from 'react';
import { LocalStorage } from '../utils/LocalStorage';

export const PrivateRoute = ({component, path}: {component: (typeof Component | FC), path: string}) => {
  const Inner = component;
  return (
      <Route path={path}
             render={props => (LocalStorage.authorizedUser ?
                     <Inner/> :
                     <Redirect to={{pathname: '/', state: {from: props.location}}}/>
             )}/>
  );
};
