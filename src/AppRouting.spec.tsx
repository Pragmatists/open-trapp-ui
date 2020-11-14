import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import * as React from 'react';
import { MobileRouting } from './AppRouting';
import { Store } from 'redux';
import { setupStore } from './utils/testUtils';

describe('App routing', () => {
  let store: Store;

  describe('mobile', () => {
    it('displays bottom navigation if user logged in', () => {
      store = initializeStore(true);

      const {getByTestId} = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/']}>
              <MobileRouting />
            </MemoryRouter>
          </Provider>
      );

      expect(getByTestId('bottom-navigation-bar')).toBeInTheDocument();
    });

    it('does not display bottom navigation if user not logged in', () => {
      store = initializeStore(false);

      const {queryByTestId} = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/']}>
              <MobileRouting />
            </MemoryRouter>
          </Provider>
      );

      expect(queryByTestId('bottom-navigation-bar')).not.toBeInTheDocument();
    });
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
