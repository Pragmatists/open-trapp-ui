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

describe('Admin Page', () => {
  let httpMock: MockAdapter;
  let store: Store;

  beforeEach(() => {
    httpMock = new MockAdapter(OpenTrappRestAPI.axios);
    httpMock
        .onGet('/api/v1/admin/service-accounts')
        .reply(200, serviceAccountsResponse);
    store = setupStore({
      authentication: {
        loggedIn: true,
        user: {
          name: 'john.doe'
        }
      }
    });
  });

  it('displays list of service accounts', async () => {
    const wrapper = mount(
        <Provider store={store}>
          <AdminPage/>
        </Provider>
    );

    await flushAllPromises();
    wrapper.update();

    expect(httpMock.history.get.filter(r => r.url = '/api/v1/admin/service-accounts')).toHaveLength(1);
    expect(wrapper.find('[data-service-account-row]').hostNodes()).toHaveLength(2);
  });

  it('displays placeholder if accounts not loaded yet', async () => {
    const wrapper = mount(
        <Provider store={store}>
          <AdminPage/>
        </Provider>
    );

    expect(httpMock.history.get.filter(r => r.url = '/api/v1/admin/service-accounts')).toHaveLength(0);
    expect(wrapper.find('[data-service-account-row]').hostNodes()).toHaveLength(0);
    expect(wrapper.find('[data-service-accounts-loading]').text()).toEqual('Loading...')
  });
});
