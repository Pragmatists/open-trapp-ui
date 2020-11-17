import * as React from 'react';
import { PrivateRoute } from './PrivateRoute';
import { LocalStorage } from '../utils/LocalStorage';
import { AuthorizedUser } from '../api/dtos';
import { someJwtToken } from '../utils/jwtUtils';
import { MemoryRouter, Route } from 'react-router';
import { render } from '@testing-library/react'
import { Provider } from 'react-redux';
import { setupStore } from '../utils/testUtils';

const SomeComponent = () => (
    <div>some component</div>
);

const LandingPage = () => (
    <div>landing page</div>
);

describe('Private route', () => {
  afterEach(() => {
    localStorage.removeItem(LocalStorage.AUTHORIZED_USER_KEY);
  });

  it('renders component if user is authorized', () => {
    LocalStorage.authorizedUser = someUserDetails('some-user');
    const container = render(
        <Provider store={initializeStore(true)}>
          <MemoryRouter initialEntries={['/some-path']}>
            <PrivateRoute component={SomeComponent} path='/some-path'/>
          </MemoryRouter>
        </Provider>
    );

    expect(container.queryByText('some component')).toBeInTheDocument();
  });

  it('redirects to landing page if user unauthorized', () => {
    LocalStorage.clearAuthorizedUser();
    const container = render(
        <Provider store={initializeStore(false)}>
          <MemoryRouter initialEntries={['/some-path']}>
            <PrivateRoute component={SomeComponent} path='/some-path'/>
            <Route component={LandingPage} path='/' exact/>
          </MemoryRouter>
        </Provider>
    );

    expect(container.queryByText('some component')).not.toBeInTheDocument();
    expect(container.queryByText('landing page')).toBeInTheDocument();
  });

  function someUserDetails(displayName: string): AuthorizedUser {
    const name = displayName.toLowerCase().replace(' ', '.');
    return {
      token: someJwtToken(displayName),
      displayName,
      name,
      email: `${name}@pragmatists.pl`,
      profilePicture: 'https://some-photo-domain.com/photo.jpg',
      roles: ['USER', 'ADMIN']
    };
  }

  function initializeStore(authorizedUser: boolean) {
    return setupStore({
      authentication: {
        loggedIn: authorizedUser
      }
    });
  }
});
