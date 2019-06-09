import MockAdapter from 'axios-mock-adapter';
import { Store } from 'redux';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
import { flushAllPromises, setupStore } from '../../utils/testUtils';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as React from 'react';
import { AdminPage } from './AdminPage';

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
        .onGet('/api/v1/admin/service-accounts')
        .reply(200, serviceAccountsResponse)
        .onGet('/api/v1/admin/authorized-users')
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
    await flushAllPromises();
    httpMock.reset();
  });

  describe('service accounts', () => {
    it('displays list of service accounts', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );

      await flushAllPromises();
      wrapper.update();

      expect(httpMock.history.get.filter(r => r.url === '/api/v1/admin/service-accounts')).toHaveLength(1);
      expect(serviceAccounts(wrapper)).toHaveLength(2);
      expect(serviceAccount(wrapper, 0).find('[data-account-name]').hostNodes().text()).toEqual('Account 1');
      expect(serviceAccount(wrapper, 0).find('[data-account-client-id]').hostNodes().text()).toEqual('id1');
      expect(serviceAccount(wrapper, 0).find('[data-account-owner]').hostNodes().text()).toEqual('john.doe');
    });

    it('displays placeholder if accounts not loaded yet', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );

      expect(httpMock.history.get.filter(r => r.url === '/api/v1/admin/service-accounts')).toHaveLength(0);
      expect(serviceAccounts(wrapper)).toHaveLength(0);
      expect(wrapper.find('[data-service-accounts-loading]').text()).toEqual('Loading...');
    });

    function serviceAccounts(wrapper) {
      return wrapper.find('[data-service-account-row]').hostNodes();
    }

    function serviceAccount(wrapper, idx: number) {
      return wrapper.find('[data-service-account-row]').at(idx);
    }
  });

  describe('users', () => {
    it('displays list of users', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );

      await flushAllPromises();
      wrapper.update();

      expect(httpMock.history.get.filter(r => r.url === '/api/v1/admin/authorized-users')).toHaveLength(1);
      expect(authorizedUsers(wrapper)).toHaveLength(2);
      expect(authorizedUser(wrapper, 0).find('[data-user-name]').hostNodes().text()).toEqual('john.doe');
      expect(authorizedUser(wrapper, 0).find('[data-user-email]').hostNodes().text()).toEqual('john.doe@pragmatists.pl');
      expect(authorizedUser(wrapper, 0).find('[data-user-roles]').hostNodes().text()).toEqual('ADMIN');
    });

    it('displays placeholder if users not loaded yet', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );

      expect(httpMock.history.get.filter(r => r.url === '/api/v1/admin/authorized-users')).toHaveLength(0);
      expect(authorizedUsers(wrapper)).toHaveLength(0);
      expect(wrapper.find('[data-authorized-users-loading]').text()).toEqual('Loading...');
    });

    function authorizedUsers(wrapper) {
      return wrapper.find('[data-authorized-user-row]').hostNodes();
    }

    function authorizedUser(wrapper, idx: number) {
      return wrapper.find('[data-authorized-user-row]').at(idx);
    }
  });
});
