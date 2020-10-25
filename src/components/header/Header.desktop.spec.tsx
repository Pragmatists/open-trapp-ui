import * as React from 'react';
import { noop } from 'lodash';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { setupStore } from '../../utils/testUtils';
import { HeaderDesktop, HeaderComponent } from './Header.desktop';
import { render, fireEvent } from '@testing-library/react';

describe('Header - desktop', () => {
  let store: Store;

  it('renders Google login if user is not logged in', () => {
    const container = render(
        <HeaderComponent isLoggedIn={false} onLogout={noop} onGoogleToken={noop} onMenuButtonClick={noop}/>
    );

    expect(container.getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('does not render UserDetails if user is not logged in', () => {
    const container = render(
        <HeaderComponent isLoggedIn={false} onLogout={noop} onGoogleToken={noop} onMenuButtonClick={noop}/>
    );

    expect(container.queryByTestId('user-details')).not.toBeInTheDocument();
  });

  it('renders UserDetails if user is logged in', () => {
    const container = render(
        <HeaderComponent isLoggedIn={true} onLogout={noop} onGoogleToken={noop} onMenuButtonClick={noop} username={'John Doe'}/>
    );

    expect(container.getByText('John Doe')).toBeInTheDocument();
  });

  it('does not render Google login if user is logged in', () => {
    const container = render(
        <HeaderComponent isLoggedIn={true} onLogout={noop} onGoogleToken={noop} onMenuButtonClick={noop}/>
    );

    expect(container.queryByText('Sign in with Google')).not.toBeInTheDocument();
  });

  it('changes menu visibility on menu button click', () => {
    store = initializeStore(true, false);
    const container = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HeaderDesktop/>
          </MemoryRouter>
        </Provider>
    );

    fireEvent.click(container.getByLabelText('Menu'));

    expect(store.getState().leftMenu.open).toBeTruthy();
  });

  function initializeStore(authorizedUser: boolean, menuVisible: boolean) {
    return setupStore({
      authentication: authorizedUser ? {
        loggedIn: true,
        user: {
          name: 'john.doe'
        }
      } : {loggedIn: false},
      leftMenu: {open: menuVisible}
    });
  }
});
