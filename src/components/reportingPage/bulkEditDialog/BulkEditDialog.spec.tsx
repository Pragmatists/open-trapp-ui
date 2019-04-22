import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as React from 'react';
import { BulkEditDialog } from './BulkEditDialog';
import MockAdapter from 'axios-mock-adapter';
import { Store } from 'redux';
import { flushAllPromises, setupStore } from '../../../utils/testUtils';
import { initialState as registrationInitialState } from '../../../redux/registration.reducer';
import { initialState as reportingInitialState } from '../../../redux/reporting.reducer';
import { OpenTrappRestAPI } from '../../../api/OpenTrappAPI';

const workLogResponse = [
  {id: 'jd1', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 480, day: '2019/03/01'},
];

describe('Bulk edit dialog', () => {
  let httpMock: MockAdapter;
  let store: Store;

  beforeEach(() => {
    httpMock = new MockAdapter(OpenTrappRestAPI.axios);
    httpMock
        .onGet(/\/api\/v1\/work-log\/bulk-update\/.*$/)
        .reply(200, {entriesAffected: 1})
        .onPost('/api/v1/work-log/bulk-update')
        .reply(200, {entriesAffected: 1})
        .onGet('/api/v1/calendar/2019/3/work-log/entries')
        .reply(200, workLogResponse);
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
      reporting: {
        ...reportingInitialState(),
        selectedTags: ['projects', 'nvm', 'jld'],
        selectedEmployees: ['john.doe', 'tom.hanks']
      }
    });
  });

  it('by default displays and validates query for selected tags and users', async () => {
    const wrapper = mount(
        <Provider store={store}>
          <BulkEditDialog />
        </Provider>
    );
    openDialogButton(wrapper).simulate('click');
    await flushAllPromises();
    wrapper.update();

    expect(queryText(wrapper)).toEqual('@2019/03 #projects #nvm #jld *john.doe *tom.hanks');
    expect(hintText(wrapper)).toEqual('Hint: 1 worklog entry will be affected by this operation.');
  });

  it('validates query on change', async () => {
    const wrapper = mount(
        <Provider store={store}>
          <BulkEditDialog />
        </Provider>
    );
    openDialogButton(wrapper).simulate('click');

    typeQuery(wrapper, '@2019/03 #projects #nvm *john.doe');
    await flushAllPromises();
    wrapper.update();
    expect(httpMock.history.get.length).toEqual(2);
    expect(httpMock.history.get[1].url)
        .toEqual('/api/v1/work-log/bulk-update/!date=2019:03+!project=projects+!project=nvm+!employee=john.doe');
  });

  it('updates entries on UPDATE button click', async () => {
    const wrapper = mount(
        <Provider store={store}>
          <BulkEditDialog />
        </Provider>
    );
    openDialogButton(wrapper).simulate('click');

    typeQuery(wrapper, '@2019/03 #projects #nvm *john.doe');
    typeExpression(wrapper, '-#nvm +#jld');
    updateButton(wrapper).simulate('click');
    await flushAllPromises();
    wrapper.update();

    expect(httpMock.history.post.length).toEqual(1);
    expect(httpMock.history.post[0].url).toEqual('/api/v1/work-log/bulk-update');
    expect(JSON.parse(httpMock.history.post[0].data)).toEqual({
      query: '@2019/03 #projects #nvm *john.doe',
      expression: '-#nvm +#jld'
    });
    expect(httpMock.history.get[2].url).toEqual('/api/v1/calendar/2019/3/work-log/entries');
  });

  function queryInput(wrapper) {
    return wrapper.find('[data-bulk-edit-query]').hostNodes().find('input');
  }

  function expressionInput(wrapper) {
    return wrapper.find('[data-bulk-edit-expression]').hostNodes().find('input');
  }

  function queryText(wrapper) {
    return queryInput(wrapper).instance().value;
  }

  function openDialogButton(wrapper) {
    return wrapper.find('[data-bulk-edit-open-button]').hostNodes();
  }

  function typeQuery(wrapper, query: string) {
    const input = queryInput(wrapper);
    input.simulate('change', {target: {value: query}});
  }

  function typeExpression(wrapper, expression: string) {
    const input = expressionInput(wrapper);
    input.simulate('change', {target: {value: expression}});
  }

  function updateButton(wrapper) {
    return wrapper.find('[data-bulk-edit-update-button]').hostNodes();
  }

  function hintText(wrapper) {
    return wrapper.find('[data-hint-text]').text();
  }
});