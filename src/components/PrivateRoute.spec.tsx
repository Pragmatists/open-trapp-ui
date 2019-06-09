import * as React from 'react';
import { mount } from 'enzyme';
import { PrivateRoute } from './PrivateRoute';
import { FC } from 'react';
import { LocalStorage } from '../utils/LocalStorage';
import { AuthorizedUser } from '../api/dtos';
import { someJwtToken } from '../utils/jwtUtils';
import { MemoryRouter, Redirect, Route } from 'react-router';

const SomeComponent: FC = () => (
    <div>some component</div>
);

const LandingPage: FC = () => (
    <div>landing page</div>
);

describe('Private route', () => {
  afterEach(() => {
    localStorage.removeItem(LocalStorage.AUTHORIZED_USER_KEY);
  });

  it('renders component if user is authorized', () => {
    LocalStorage.authorizedUser = someUserDetails('some-user');
    const wrapper = mount(
        <MemoryRouter initialEntries={['/some-path']}>
          <PrivateRoute component={SomeComponent} path='/some-path'/>
        </MemoryRouter>
    );

    expect(wrapper.find(SomeComponent)).toHaveLength(1);
    expect(wrapper.find(Redirect)).toHaveLength(0);
  });

  it('redirects to landing page if user unauthorized', () => {
    LocalStorage.clearAuthorizedUser();
    const wrapper = mount(
        <MemoryRouter initialEntries={['/some-path']}>
          <PrivateRoute component={SomeComponent} path='/some-path'/>
          <Route component={LandingPage} path='/' exact/>
        </MemoryRouter>
    );
    wrapper.update();

    expect(wrapper.find(SomeComponent)).toHaveLength(0);
    expect(wrapper.find(LandingPage)).toHaveLength(1);
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
});
