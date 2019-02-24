import * as React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { setupStore } from '../../utils/testUtils';
import { RegistrationPageDesktop } from './RegistrationPage.desktop';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
import createMount from '@material-ui/core/test-utils/createMount';
import { MonthlyReport } from '../monthlyReport/MonthlyReport';
import { TableCell } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';

const days = [
  {id: '2019/02/01', weekend: false, holiday: false},
  {id: '2019/02/02', weekend: true, holiday: false},
  {id: '2019/02/03', weekend: true, holiday: false},
  {id: '2019/02/04', weekend: false, holiday: false},
  {id: '2019/02/05', weekend: false, holiday: false},
  {id: '2019/02/06', weekend: false, holiday: true}
];

const currentMonthResponse = {
  id: '2019/02',
  link: '/api/v1/2019/02',
  next: '/api/v1/2019/03',
  prev: '/api/v1/2019/01',
  days: days
};

describe('RegistrationPageDesktop', () => {
  let mount: ReturnType<typeof createMount>;
  let httpMock: MockAdapter;
  let store: Store;

  const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));

  beforeEach(() => {
    mount = createMount();
    httpMock = new MockAdapter(OpenTrappRestAPI.axios);
    store = setupStore({
      calendar: {
        selectedMonth: {
          year: 2019,
          month: 2
        }
      }
    });
  });

  afterEach(() => {
   mount.cleanUp();
  });

  it('should fetch and render days with workload for current month', async () => {
    httpMock
        .onGet('/api/v1/calendar/2019/2')
        .reply(200, currentMonthResponse);

    const wrapper = mount(
        <Provider store={store}>
          <RegistrationPageDesktop/>
        </Provider>
    );

    await flushAllPromises();
    wrapper.update();

    expect(httpMock.history.get.length).toEqual(1);
    expect(wrapper.find(MonthlyReport).exists()).toBeTruthy();
    expect(tableHeaderCells(wrapper)).toHaveLength(days.length + 1);
  });

  function tableHeaderCells(wrapper) {
    return wrapper.find(Table).find(TableHead).find(TableCell);
  }
});
