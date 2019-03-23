import * as React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { chain } from 'lodash';
import { mount, ReactWrapper } from 'enzyme';
import { InputBase, TableCell } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import { flushAllPromises, setupStore } from '../../utils/testUtils';
import { RegistrationPageDesktop } from './RegistrationPage.desktop';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
import { MonthlyReport } from '../monthlyReport/MonthlyReport';
import { RegistrationPageMonth } from '../registrationPageMonth/RegistrationPageMonth';
import { initialState as registrationInitialState } from '../../redux/registration.reducer';

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
  {employee: 'john.doe', day: '2019/02/01', workload: 480, projectNames: ['projects', 'nvm']},
  {employee: 'andy.barber', day: '2019/02/01', workload: 420, projectNames: ['projects', 'nvm']},
  {employee: 'john.doe', day: '2019/02/04', workload: 450, projectNames: ['projects', 'nvm']},
  {employee: 'john.doe', day: '2019/02/04', workload: 30, projectNames: ['internal', 'standup']},
  {employee: 'andy.barber', day: '2019/02/01', workload: 390, projectNames: ['projects', 'nvm']},
  {employee: 'andy.barber', day: '2019/02/01', workload: 30, projectNames: ['internal', 'standup']},
  {employee: 'andy.barber', day: '2019/02/01', workload: 0, projectNames: ['remote']}
];

const tagsResponse = chain(workLogResponse)
    .map(r => r.projectNames)
    .flatten()
    .uniq()
    .value();

describe('Registration Page - desktop', () => {
  let httpMock: MockAdapter;
  let store: Store;

  beforeEach(() => {
    httpMock = new MockAdapter(OpenTrappRestAPI.axios);
    httpMock
        .onGet(/\/api\/v1\/calendar\/2019\/\d$/)
        .reply(200, monthResponse)
        .onGet(/\/api\/v1\/calendar\/2019\/\d\/work-log\/entries$/)
        .reply(200, workLogResponse)
        .onGet('/api/v1/projects')
        .reply(200, tagsResponse)
        .onPost('/api/v1/employee/john.doe/work-log/entries')
        .reply(201, {id: '123-456'});
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
      },
      registration: registrationInitialState()
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

      expect(httpMock.history.get.filter(r => r.url.startsWith('/api/v1/calendar'))).toHaveLength(2);
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

      expect(httpMock.history.get.filter(r => r.url.startsWith('/api/v1/calendar'))).toHaveLength(4);
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

      expect(httpMock.history.get.filter(r => r.url.startsWith('/api/v1/calendar'))).toHaveLength(4);
      expect(wrapper.find(MonthlyReport).exists()).toBeTruthy();
      expect(currentMonthHeader(wrapper).text()).toEqual('2019/01 month worklog');
    });

    it('adds day to work log expression on day click', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      dayCell(wrapper, 0).simulate('click');

      expect(workLogInputValue(wrapper)).toEqual('@2019/02/01');
    });

    it('modifies work log expression on day range click', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );
      await flushAllPromises();

      typeExpression(wrapper, '1d @2019/02/03 #holiday');

      dayCell(wrapper, 0).simulate('click', {shiftKey: true});
      wrapper.update();

      expect(workLogInputValue(wrapper)).toEqual('1d @2019/02/01~@2019/02/03 #holiday');
    });

    function tableHeaderCells(wrapper): ReactWrapper {
      return wrapper.find(Table).find(TableHead).find(TableCell);
    }

    function tableRowCells(wrapper, rowIdx: number): ReactWrapper {
      return wrapper.find(Table).find(TableBody).find(TableRow).at(rowIdx).find(TableCell);
    }

    function dayCell(wrapper, dayIndex: number): ReactWrapper {
      return tableRowCells(wrapper, 0).at(dayIndex);
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

    function workLogInputValue(wrapper) {
      return (workLogInput(wrapper).instance() as any).value;
    }
  });

  describe('Work log input', () => {
    it('fetches tags', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      expect(httpMock.history.get.filter(r => r.url === '/api/v1/projects')).toHaveLength(1);
      expect(store.getState().workLog.tags).toEqual(tagsResponse);
    });

    it('saves valid work log on enter', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      typeExpression(wrapper, '1d #projects #nvm @2019/02/27');
      pressEnter(wrapper);
      await flushAllPromises();

      expect(httpMock.history.post.length).toEqual(1);
      expect(JSON.parse(httpMock.history.post[0].data)).toEqual({
        projectNames: ['projects', 'nvm'],
        workload: '1d',
        day: '2019/02/27'
      });
    });

    it('saves work log with dates range on enter', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      typeExpression(wrapper, '1d #projects #nvm @2019/02/27~@2019/02/28');
      pressEnter(wrapper);
      await flushAllPromises();

      expect(httpMock.history.post.length).toEqual(2);
      expect(JSON.parse(httpMock.history.post[0].data)).toEqual({
        projectNames: ['projects', 'nvm'],
        workload: '1d',
        day: '2019/02/27'
      });
      expect(JSON.parse(httpMock.history.post[1].data)).toEqual({
        projectNames: ['projects', 'nvm'],
        workload: '1d',
        day: '2019/02/28'
      });
    });

    it('reloads work logs after save', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      typeExpression(wrapper, '1d #projects #nvm @2019/02/27');
      pressEnter(wrapper);
      await flushAllPromises();

      expect(httpMock.history.get.filter(r => r.url === '/api/v1/calendar/2019/2/work-log/entries')).toHaveLength(2);
    });

    function pressEnter(wrapper) {
      const input = workLogInput(wrapper);
      input.simulate('keypress', {key: 'Enter'});
    }
  });

  function workLogInput(wrapper): ReactWrapper {
    return wrapper.find(InputBase).at(0).find('input');
  }

  function typeExpression(wrapper, expression: string) {
    const input = workLogInput(wrapper);
    input.simulate('change', {target: {value: expression}})
  }
});
