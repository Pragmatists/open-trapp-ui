import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import * as React from 'react';
import { Notifications } from './Notifications';
import { Store } from 'redux';
import { setupStore } from '../../utils/testUtils';
import { initialState as registrationInitialState } from '../../redux/registration.reducer';
import { initialState as notificationsInitialState } from '../../redux/notifications.reducer';

describe('Notifications', () => {
  let store: Store;

  beforeEach(() => {
    store = setupStore({
      authentication: {
        loggedIn: true,
        user: {
          name: 'john.doe'
        }
      },
      calendar: {
        selectedMonth: {
          year: 2019,
          month: 3
        }
      },
      registration: registrationInitialState(),
      notifications: notificationsInitialState()
    });
  });


  it('does not display anything if list is empty', () => {
    const { queryByTestId } = render(
        <Provider store={store}>
          <Notifications />
        </Provider>
    );

    expect(queryByTestId('snackbar')).not.toBeInTheDocument();
  });
});
