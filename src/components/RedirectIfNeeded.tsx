import React from 'react';
import { parse } from "querystring";
import { Redirect } from 'react-router';

export const RedirectIfNeeded = (ComposedComponent) => {
  return (props) => {
    const params = parse(props.location.search.replace('?', ''));
    const redirect = params.redirect as string;
    if (redirect) {
      return <Redirect to={{pathname: redirect, state: {from: props.location}}}/>;
    } else {
      return <ComposedComponent props={props}/>
    }
  }
};
