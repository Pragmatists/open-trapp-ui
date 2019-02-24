import * as React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { setupStore } from '../../utils/testUtils';
import { RegistrationPageDesktop } from './RegistrationPage.desktop';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
import { MonthlyReport } from '../monthlyReport/MonthlyReport';
import { TableCell } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { mount, ReactWrapper } from 'enzyme';

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

const workLogResponse = [
  {employee: 'john.doe', day: '2019/02/01', workload: 480, projectNames: ['project', 'nvm']},
  {employee: 'andy.barber', day: '2019/02/01', workload: 420, projectNames: ['project', 'nvm']},
  {employee: 'john.doe', day: '2019/02/04', workload: 450, projectNames: ['project', 'nvm']},
  {employee: 'john.doe', day: '2019/02/04', workload: 30, projectNames: ['internal', 'standup']},
  {employee: 'andy.barber', day: '2019/02/01', workload: 390, projectNames: ['project', 'nvm']},
  {employee: 'andy.barber', day: '2019/02/01', workload: 30, projectNames: ['internal', 'standup']},
  {employee: 'andy.barber', day: '2019/02/01', workload: 0, projectNames: ['remote']}
];

describe('RegistrationPageDesktop', () => {
  let httpMock: MockAdapter;
  let store: Store;

  const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));

  beforeEach(() => {
    httpMock = new MockAdapter(OpenTrappRestAPI.axios);
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
          month: 2
        }
      }
    });
  });

  it('should fetch and render days with workload for current month', async () => {
    httpMock
        .onGet('/api/v1/calendar/2019/2')
        .reply(200, currentMonthResponse)
        .onGet('/api/v1/calendar/2019/2/work-log/entries')
        .reply(200, workLogResponse);

    const wrapper = mount(
        <Provider store={store}>
          <RegistrationPageDesktop/>
        </Provider>
    );

    await flushAllPromises();
    wrapper.update();

    expect(httpMock.history.get.length).toEqual(2);
    expect(wrapper.find(MonthlyReport).exists()).toBeTruthy();
    expect(tableHeaderCells(wrapper).not('[data-total-header]')).toHaveLength(days.length);
    expect(tableRowCells(wrapper, 0).not('[data-total-value]')).toHaveLength(days.length);
    expect(tableRowCells(wrapper, 0).at(0).text()).toEqual('8');
    expect(tableRowCells(wrapper, 0).at(1).text()).toEqual('');
    expect(tableRowCells(wrapper, 0).at(2).text()).toEqual('');
    expect(tableRowCells(wrapper, 0).at(3).text()).toEqual('8');
    expect(totalCell(wrapper, 0).text()).toEqual('16');
  });

  function tableHeaderCells(wrapper): ReactWrapper {
    return wrapper.find(Table).find(TableHead).find(TableCell);
  }

  function tableRowCells(wrapper, rowIdx: number): ReactWrapper {
    return wrapper.find(Table).find(TableBody).find(TableRow).at(rowIdx).find(TableCell);
  }

  function totalCell(wrapper, rowIdx: number) {
    return tableRowCells(wrapper, rowIdx).at(days.length);
  }
});
