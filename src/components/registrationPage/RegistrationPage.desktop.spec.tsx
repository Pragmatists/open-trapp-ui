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
import { RegistrationPageMonth } from '../registrationPageMonth/RegistrationPageMonth';
import Button from '@material-ui/core/Button';

const days = [
  {id: '2019/02/01', weekend: false, holiday: false},
  {id: '2019/02/02', weekend: true, holiday: false},
  {id: '2019/02/03', weekend: true, holiday: false},
  {id: '2019/02/04', weekend: false, holiday: false},
  {id: '2019/02/05', weekend: false, holiday: false},
  {id: '2019/02/06', weekend: false, holiday: true}
];

const monthResponse = {
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
    httpMock
      .onGet(/\/api\/v1\/calendar\/2019\/\d$/)
      .reply(200, monthResponse)
      .onGet(/\/api\/v1\/calendar\/2019\/\d\/work-log\/entries$/)
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
          month: 2
        }
      }
    });
  });

  describe('Monthly report', () => {
    it('displays current month', async () => {
      const wrapper = mount(
        <Provider store={store}>
          <RegistrationPageDesktop/>
        </Provider>
      );

      await flushAllPromises();
      wrapper.update();

      expect(currentMonthHeader(wrapper).text()).toEqual('2019/02 month worklog');
    });

    it('fetches and renders days with workload for current month', async () => {
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

    it('reloads data on NEXT month click', async () => {
      const wrapper = mount(
        <Provider store={store}>
          <RegistrationPageDesktop/>
        </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      nextMonthButton(wrapper).simulate('click');
      await flushAllPromises();
      wrapper.update();

      expect(httpMock.history.get.length).toEqual(4);
      expect(wrapper.find(MonthlyReport).exists()).toBeTruthy();
      expect(currentMonthHeader(wrapper).text()).toEqual('2019/03 month worklog');
    });

    it('reloads data on PREVIOUS month click', async () => {
      const wrapper = mount(
        <Provider store={store}>
          <RegistrationPageDesktop/>
        </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      previousMonthButton(wrapper).simulate('click');
      await flushAllPromises();
      wrapper.update();

      expect(httpMock.history.get.length).toEqual(4);
      expect(wrapper.find(MonthlyReport).exists()).toBeTruthy();
      expect(currentMonthHeader(wrapper).text()).toEqual('2019/01 month worklog');
    });

    function tableHeaderCells(wrapper): ReactWrapper {
      return wrapper.find(Table).find(TableHead).find(TableCell);
    }

    function tableRowCells(wrapper, rowIdx: number): ReactWrapper {
      return wrapper.find(Table).find(TableBody).find(TableRow).at(rowIdx).find(TableCell);
    }

    function totalCell(wrapper, rowIdx: number): ReactWrapper {
      return tableRowCells(wrapper, rowIdx).at(days.length);
    }

    function currentMonthHeader(wrapper): ReactWrapper {
      return wrapper.find('[data-selected-month-header]');
    }

    function nextMonthButton(wrapper): ReactWrapper {
      return wrapper.find(RegistrationPageMonth)
        .find(Button)
        .filter('[data-next-month-button]');
    }

    function previousMonthButton(wrapper): ReactWrapper {
      return wrapper.find(RegistrationPageMonth)
        .find(Button)
        .filter('[data-prev-month-button]');
    }
  });

  describe('Work log input', () => {
    xit('saves valid work log on enter', async () => {
      const wrapper = mount(
        <Provider store={store}>
          <RegistrationPageDesktop/>
        </Provider>
      );
      await flushAllPromises();
      wrapper.update();


    });

    function workLogInput(wrapper): ReactWrapper {
      return wrapper.find();
    }
  });
});
