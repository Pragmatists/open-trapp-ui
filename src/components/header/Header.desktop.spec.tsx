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

  it('does not render user details if user is not logged in', () => {
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

  it('renders user details if user is logged in', () => {
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

  it('does not render tabs if user not logged in', () => {
    store = initializeStore(false);
    const {queryByText} = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HeaderDesktop/>
          </MemoryRouter>
        </Provider>
    );

    expect(queryByText('Registration')).not.toBeInTheDocument();
    expect(queryByText('Reporting')).not.toBeInTheDocument();
  });

  it('renders tabs if user logged in', () => {
    store = initializeStore(true);
    const {getByText, queryByText} = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HeaderDesktop/>
          </MemoryRouter>
        </Provider>
    );

    expect(getByText('Registration')).toBeInTheDocument();
    expect(getByText('Reporting')).toBeInTheDocument();
    expect(queryByText('Admin')).not.toBeInTheDocument();
  });

  it('renders Admin tab if user has ADMIN role', () => {
    store = initializeStore(true, true);
    const {getByText} = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HeaderDesktop/>
          </MemoryRouter>
        </Provider>
    );

    expect(getByText('Admin')).toBeInTheDocument();
  });


  it.each`
    page
    ${'Registration'}
    ${'Reporting'}
    ${'Admin'}
  `(`navigates to $page page on tab click`, ({page}) => {
    store = initializeStore(true, true);
    const {getByText} = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HeaderDesktop/>
          </MemoryRouter>
        </Provider>
    );

    fireEvent.click(getByText(page));

    expect(getByText(page).parentElement).toHaveAttribute('aria-selected', 'true');
  });

  function initializeStore(authorizedUser: boolean, isAdmin = false) {
    return setupStore({
      authentication: authorizedUser ? {
        loggedIn: true,
        user: {
          name: 'john.doe',
          displayName: 'John Doe',
          roles: isAdmin ? ['ADMIN'] : []
        }
      } : {loggedIn: false}
    });
  }
});
