import { Redirect, Route } from 'react-router';
import { useSelector } from 'react-redux';
import { userLoggedInSelector } from '../selectors/selectors';

export const PrivateRoute = ({component, path}: {component: any, path: string}) => {
  const isLoggedIn = useSelector(userLoggedInSelector)
  const Inner = component;
  return (
      <Route path={path}
             render={props => (isLoggedIn ?
                     <Inner/> :
                     <Redirect to={{pathname: '/', state: {from: props.location}}}/>
             )}/>
  );
};
