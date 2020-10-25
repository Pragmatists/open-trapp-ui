import { fireEvent, render, RenderResult, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import * as React from 'react';
import { BulkEditDialog } from './BulkEditDialog';
import MockAdapter from 'axios-mock-adapter';
import { Store } from 'redux';
import { ignoreHtmlTags, setupStore } from '../../../utils/testUtils';
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
        .onGet(/\/work-log\/bulk-update\/.*$/)
        .reply(200, {entriesAffected: 1})
        .onPost('/work-log/bulk-update')
        .reply(200, {entriesAffected: 1})
        .onGet('/calendar/2019/3/work-log/entries')
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
    const {getByText, getByDisplayValue} = render(
        <Provider store={store}>
          <BulkEditDialog />
        </Provider>
    );
    fireEvent.click(getByText('Bulk edit'));
    await waitFor(() => {});

    expect(getByDisplayValue('@2019/03 #projects #nvm #jld *john.doe *tom.hanks')).toBeInTheDocument();
    expect(getByText(ignoreHtmlTags('Hint: 1 worklog entry will be affected by this operation.'))).toBeInTheDocument();
  });

  it('validates query on change', async () => {
    const container = render(
        <Provider store={store}>
          <BulkEditDialog />
        </Provider>
    );
    fireEvent.click(container.getByText('Bulk edit'));

    typeQuery(container, '@2019/03 #projects #nvm *john.doe');
    await waitFor(() => expect(httpMock.history.get.length).toEqual(2));
    expect(httpMock.history.get[1].url)
        .toEqual('/work-log/bulk-update/!date=2019:03+!project=projects+!project=nvm+!employee=john.doe');
  });

  it('updates entries on UPDATE button click', async () => {
    const container = render(
        <Provider store={store}>
          <BulkEditDialog />
        </Provider>
    );
    fireEvent.click(container.getByText('Bulk edit'));

    typeQuery(container, '@2019/03 #projects #nvm *john.doe');
    typeExpression(container, '-#nvm +#jld');
    fireEvent.click(container.getByText('Update'));

    await waitFor(() => expect(httpMock.history.post.length).toEqual(1));
    expect(httpMock.history.post[0].url).toEqual('/work-log/bulk-update');
    expect(JSON.parse(httpMock.history.post[0].data)).toEqual({
      query: '@2019/03 #projects #nvm *john.doe',
      expression: '-#nvm +#jld'
    });
    expect(httpMock.history.get[2].url).toEqual('/calendar/2019/3/work-log/entries');
  });

  function queryInput(container: RenderResult) {
    return container.getByTestId('bulk-edit-query').lastChild.firstChild;
  }

  function expressionInput(container: RenderResult) {
    return container.getByTestId('bulk-edit-expression').lastChild.firstChild;
  }

  function typeQuery(container: RenderResult, query: string) {
    fireEvent.change(queryInput(container), {target: {value: query}});
  }

  function typeExpression(container: RenderResult, expression: string) {
    fireEvent.change(expressionInput(container), {target: {value: expression}});
  }
});
