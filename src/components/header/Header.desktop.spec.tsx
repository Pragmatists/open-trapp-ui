import * as React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { setupStore } from '../../utils/testUtils';
import { HeaderDesktop } from './Header.desktop';
import { render, fireEvent } from '@testing-library/react';

describe('Header - desktop', () => {
  let store: Store;

  it('renders Google login if user is not logged in', () => {
    store = initializeStore(false);
    const {getByText} = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HeaderDesktop/>
          </MemoryRouter>
        </Provider>
    );

    expect(getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('does not render UserDetails if user is not logged in', () => {
    store = initializeStore(false);
    const {queryByTestId, queryByText} = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HeaderDesktop/>
          </MemoryRouter>
        </Provider>
    );

    expect(queryByTestId('user-details')).not.toBeInTheDocument();
    expect(queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders UserDetails if user is logged in', () => {
    store = initializeStore(true);
    const {getByText} = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HeaderDesktop/>
          </MemoryRouter>
        </Provider>
    );

    expect(getByText('John Doe')).toBeInTheDocument();
  });

  it('does not render Google login if user is logged in', () => {
    store = initializeStore(true);
    const {queryByText} = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HeaderDesktop/>
          </MemoryRouter>
        </Provider>
    );

    expect(queryByText('Sign in with Google')).not.toBeInTheDocument();
  });

  it('changes menu visibility on menu button click', () => {
    store = initializeStore(true, false);
    const {getByLabelText} = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HeaderDesktop/>
          </MemoryRouter>
        </Provider>
    );

    fireEvent.click(getByLabelText('Menu'));

    expect(store.getState().leftMenu.open).toBeTruthy();
  });

  function initializeStore(authorizedUser: boolean, menuVisible = false) {
    return setupStore({
      authentication: authorizedUser ? {
        loggedIn: true,
        user: {
          name: 'john.doe',
          displayName: 'John Doe'
        }
      } : {loggedIn: false},
      leftMenu: {open: menuVisible}
    });
  }
});
