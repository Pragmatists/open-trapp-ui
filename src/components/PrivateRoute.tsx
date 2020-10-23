import { Redirect, Route } from 'react-router';
import React from 'react';
import { LocalStorage } from '../utils/LocalStorage';

export const PrivateRoute = ({component, path}: {component: any, path: string}) => {
  const Inner = component;
  return (
      <Route path={path}
             render={props => (LocalStorage.authorizedUser ?
                     <Inner/> :
                     <Redirect to={{pathname: '/', state: {from: props.location}}}/>
             )}/>
  );
};
