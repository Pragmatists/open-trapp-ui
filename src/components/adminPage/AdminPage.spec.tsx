import MockAdapter from 'axios-mock-adapter';
import { Store } from 'redux';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
import { flushAllPromises, setupStore } from '../../utils/testUtils';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import * as React from 'react';
import { AdminPage } from './AdminPage';
import TextField from '@material-ui/core/TextField';
import { ServiceAccountDialog } from './serviceAccountDialog/ServiceAccountDialog';

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

      expect(httpMock.history.get.filter(r => r.url === '/admin/service-accounts')).toHaveLength(1);
      expect(serviceAccounts(wrapper)).toHaveLength(2);
      expect(serviceAccount(wrapper, 0).find('[data-account-name]').hostNodes().text()).toEqual('Account 1');
      expect(serviceAccount(wrapper, 0).find('[data-account-client-id]').hostNodes().text()).toEqual('id1');
      expect(serviceAccount(wrapper, 0).find('[data-account-owner]').hostNodes().text()).toEqual('john.doe');
    });

    it('displays DELETE button only if owner of account matches', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      expect(serviceAccount(wrapper, 0).find('[data-account-delete-button]').hostNodes()).toHaveLength(1);
      expect(serviceAccount(wrapper, 1).find('[data-account-delete-button]').hostNodes()).toHaveLength(0);
    });

    it('displays placeholder if accounts not loaded yet', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );

      expect(httpMock.history.get.filter(r => r.url === '/admin/service-accounts')).toHaveLength(0);
      expect(serviceAccounts(wrapper)).toHaveLength(0);
      expect(wrapper.find('[data-service-accounts-loading]').text()).toEqual('Loading...');
    });

    it('creates service account', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );
      await flushAllPromises();

      createServiceAccountButton(wrapper).simulate('click');
      type(wrapper, 'Some service account');
      dialogCreateButton(wrapper).simulate('click');
      await flushAllPromises();
      wrapper.update();
      expect(clientID(wrapper)).toEqual('client-id');
      expect(clientSecret(wrapper)).toEqual('client-secret');

      dialogCloseButton(wrapper).simulate('click');
      await flushAllPromises();
      wrapper.update();

      expect(httpMock.history.post.filter(r => r.url === '/admin/service-accounts')).toHaveLength(1);
      expect(httpMock.history.get.filter(r => r.url === '/admin/service-accounts')).toHaveLength(2);
    });

    it('does not crete service account on CANCEL', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );
      await flushAllPromises();

      createServiceAccountButton(wrapper).simulate('click');
      type(wrapper, 'Some service account');
      dialogCancelButton(wrapper).simulate('click');
      await flushAllPromises();

      expect(httpMock.history.post.filter(r => r.url === '/admin/service-accounts')).toHaveLength(0);
      expect(httpMock.history.get.filter(r => r.url === '/admin/service-accounts')).toHaveLength(1);
    });

    it('deletes service account', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <AdminPage/>
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      serviceAccount(wrapper, 0).find('[data-account-delete-button]').hostNodes().simulate('click');
      await flushAllPromises();
      wrapper.update();

      expect(httpMock.history.delete.filter(r => r.url === '/admin/service-accounts/id1')).toHaveLength(1);
      expect(serviceAccounts(wrapper)).toHaveLength(1);
    });

    function serviceAccounts(wrapper) {
      return wrapper.find('[data-service-account-row]').hostNodes();
    }

    function serviceAccount(wrapper, idx: number) {
      return wrapper.find('[data-service-account-row]').hostNodes().at(idx);
    }

    function type(wrapper, expression: string) {
      const input = serviceNameInput(wrapper);
      input.simulate('change', {target: {value: expression}});
      input.simulate('focus');
    }

    function serviceNameInput(wrapper): ReactWrapper {
      return wrapper.find(TextField).at(0).find('input');
    }

    function createServiceAccountButton(wrapper) {
      return wrapper.find('[data-create-service-account-button]');
    }

    function dialogCreateButton(wrapper) {
      return wrapper.find(ServiceAccountDialog).find('[data-create-button]').hostNodes();
    }

    function dialogCancelButton(wrapper) {
      return wrapper.find(ServiceAccountDialog).find('[data-cancel-button]').hostNodes();
    }

    function dialogCloseButton(wrapper) {
      return wrapper.find(ServiceAccountDialog).find('[data-close-button]').hostNodes();
    }

    function clientID(wrapper) {
      return wrapper.find(ServiceAccountDialog)
          .find('[data-client-id-field]').find('input').instance().value;
    }

    function clientSecret(wrapper) {
      return wrapper.find(ServiceAccountDialog)
          .find('[data-client-secret-field]').find('input').instance().value;
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

      expect(httpMock.history.get.filter(r => r.url === '/admin/users')).toHaveLength(1);
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

      expect(httpMock.history.get.filter(r => r.url === '/admin/users')).toHaveLength(0);
      expect(authorizedUsers(wrapper)).toHaveLength(0);
      expect(wrapper.find('[data-users-loading]').text()).toEqual('Loading...');
    });

    function authorizedUsers(wrapper) {
      return wrapper.find('[data-authorized-user-row]').hostNodes();
    }

    function authorizedUser(wrapper, idx: number) {
      return wrapper.find('[data-authorized-user-row]').hostNodes().at(idx);
    }
  });
});
