import MockAdapter from 'axios-mock-adapter';
import { Store } from 'redux';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
import { setupStore } from '../../utils/testUtils';
import { Provider } from 'react-redux';
import * as React from 'react';
import { AdminPage } from './AdminPage';
import { render, RenderResult, waitFor, within, fireEvent } from '@testing-library/react';

const serviceAccountsResponse = [
  {name: 'Account 1', clientID: 'id1', owner: 'john.doe'},
  {name: 'Account 2', clientID: 'id2', owner: 'tom.hanks'}
];

const usersResponse = [
  {email: 'john.doe@pragmatists.pl', name: 'john.doe', roles: ['ADMIN']},
  {email: 'tom.hanks@pragmatists.pl', name: 'tom.hanks', roles: ['ADMIN', 'USER']}
];

describe('Admin Page', () => {
  let httpMock = new MockAdapter(OpenTrappRestAPI.axios);
  let store: Store;

  beforeEach(() => {
    httpMock
        .onGet('/admin/service-accounts')
        .reply(200, serviceAccountsResponse)
        .onPost('/admin/service-accounts')
        .reply(200, {clientID: 'client-id', secret: 'client-secret'})
        .onDelete('/admin/service-accounts/id1')
        .reply(200, {})
        .onGet('/admin/users')
        .reply(200, usersResponse);
    store = setupStore({
      authentication: {
        loggedIn: true,
        user: {
          name: 'john.doe'
        }
      }
    });
  });

  afterEach(async () => {
    httpMock.reset();
  });

  describe('service accounts', async () => {
    const rowByClientId = (container: RenderResult, clientId: string) => {
      const row = container.getByText(clientId).closest("tr");
      return within(row);
    }

    const assertRow = (container: RenderResult, clientId: string, accountName: string, accountOwner: string) => {
      const utils = rowByClientId(container, clientId);
      expect(utils.getByText(accountName)).toBeInTheDocument();
      expect(utils.getByText(accountOwner)).toBeInTheDocument();
    }

    it('displays list of service accounts', async () => {
      const container = render(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );

      await waitFor(() => expect(httpMock.history.get.filter(r => r.url === '/admin/service-accounts')).toHaveLength(1));
      expect(container.queryAllByTestId('service-account-row')).toHaveLength(2);
      assertRow(container, 'id1', 'Account 1', 'john.doe');
      assertRow(container, 'id2', 'Account 2', 'tom.hanks');
    });

    it('displays DELETE button only if owner of account matches', async () => {
      const container = render(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );
      await waitFor(() => {
      });

      const row1 = rowByClientId(container, 'id1');
      expect(row1.queryByTestId('delete-account-button')).toBeInTheDocument();
      const row2 = rowByClientId(container, 'id2');
      expect(row2.queryByTestId('delete-account-button')).not.toBeInTheDocument();
    });

    it('displays placeholder if accounts not loaded yet', () => {
      const container = render(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );

      expect(httpMock.history.get.filter(r => r.url === '/admin/service-accounts')).toHaveLength(0);
      expect(container.queryAllByTestId('service-account-row')).toHaveLength(0);
      expect(container.getByText('Loading accounts...')).toBeInTheDocument();
    });

    it('creates service account', async () => {
      const container = render(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );

      fireEvent.click(container.getByText('Create'));
      const input = getInputByLabel(container, 'Account name');
      fireEvent.change(input, {target: {value: 'Some service account'}});
      fireEvent.click(container.getByTestId('create-button'));
      await waitFor(() => expect(httpMock.history.post.filter(r => r.url === '/admin/service-accounts')).toHaveLength(1));

      expect(container.getByDisplayValue('client-id')).toBeInTheDocument();
      expect(container.getByDisplayValue('client-secret')).toBeInTheDocument();

      fireEvent.click(container.getByText('Close'));

      await waitFor(() => expect(httpMock.history.get.filter(r => r.url === '/admin/service-accounts')).toHaveLength(2));
    });

    it('does not crete service account on CANCEL', async () => {
      const container = render(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );

      fireEvent.click(container.getByText('Create'));
      fireEvent.change(getInputByLabel(container, 'Account name'), {target: {value: 'Some service account'}});
      fireEvent.click(container.getByText('Cancel'));
      await waitFor(() => {
      });

      expect(httpMock.history.post.filter(r => r.url === '/admin/service-accounts')).toHaveLength(0);
      expect(httpMock.history.get.filter(r => r.url === '/admin/service-accounts')).toHaveLength(1);
    });

    it('deletes service account', async () => {
      const container = render(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );
      await waitFor(() => {
      });

      fireEvent.click(rowByClientId(container, 'id1').getByTestId('delete-account-button'))

      await waitFor(() => expect(httpMock.history.delete.filter(r => r.url === '/admin/service-accounts/id1')).toHaveLength(1));
      expect(container.queryAllByTestId('service-account-row')).toHaveLength(1);
    });

    function getInputByLabel(container, label: string) {
      return container.getByText(label).nextSibling.firstChild;
    }
  });

  describe('users', () => {
    const rowByEmail = (container: RenderResult, email: string) => {
      const row = container.getByText(email).closest("tr");
      return within(row);
    }

    const assertRow = (container: RenderResult, username: string, email: string, roles: string) => {
      const utils = rowByEmail(container, email);
      expect(utils.getByText(username)).toBeInTheDocument();
      expect(utils.getByText(roles)).toBeInTheDocument();
    }

    it('displays list of users', async () => {
      const container = render(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );

      await waitFor(() => expect(httpMock.history.get.filter(r => r.url === '/admin/users')).toHaveLength(1));
      expect(container.queryAllByTestId('authorized-user-row')).toHaveLength(2);
      assertRow(container, 'john.doe', 'john.doe@pragmatists.pl', 'ADMIN');
    });

    it('displays placeholder if users not loaded yet', async () => {
      const container = render(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );

      expect(httpMock.history.get.filter(r => r.url === '/admin/users')).toHaveLength(0);
      expect(container.queryAllByTestId('authorized-user-row')).toHaveLength(0);
      expect(container.getByText('Loading users...')).toBeInTheDocument();
    });
  });
});
