import * as React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { setupStore } from '../../utils/testUtils';
import { HeaderMobile } from './Header.mobile';
import { render } from '@testing-library/react'

describe('Header - mobile', () => {
  let store: Store;

  it('renders Google login if user is not logged in', () => {
    store = initializeStore(false);
    const container = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HeaderMobile/>
          </MemoryRouter>
        </Provider>
    );

    expect(container.getByText('Sign in')).toBeInTheDocument();
  });

  it('does not render UserDetails if user is not logged in', () => {
    store = initializeStore(false);
    const container = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HeaderMobile/>
          </MemoryRouter>
        </Provider>
    );

    expect(container.queryByTestId('user-details')).not.toBeInTheDocument();
  });

  it('renders UserDetails if user is logged in', () => {
    store = initializeStore(true);
    const container = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HeaderMobile/>
          </MemoryRouter>
        </Provider>
    );

    expect(container.queryByTestId('user-details')).toBeInTheDocument();
  });

  it('does not render Google login if user is logged in', () => {
    store = initializeStore(true);
    const container = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HeaderMobile/>
          </MemoryRouter>
        </Provider>
    );

    expect(container.queryByText('Sign in')).not.toBeInTheDocument();
  });

  function initializeStore(authorizedUser: boolean) {
    return setupStore({
      authentication: authorizedUser ? {
        loggedIn: true,
        user: {
          name: 'john.doe',
          displayName: 'John Doe'
        }
      } : {loggedIn: false}
    });
  }
});
