import MockAdapter from 'axios-mock-adapter';
import { Store } from 'redux';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
import { flushAllPromises, setupStore } from '../../utils/testUtils';
import { initialState as registrationInitialState } from '../../redux/registration.reducer';
import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import { ReportingPageDesktop } from './ReportingPage.desktop';
import { Button, Chip, TableRow } from '@material-ui/core';
import { initialState as reportingInitialState } from '../../redux/reporting.reducer';
import { MonthlyReport } from '../monthlyReport/MonthlyReport';
import { TableReport } from './tableReport/TableReport';
import TableBody from '@material-ui/core/TableBody';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import { Month } from '../../utils/Month';
import { ProjectsReport } from './projectsReport/ProjectsReport';

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
  {id: 'jd1', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 480, day: '2019/03/01'},
  {id: 'jd2', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 420, day: '2019/03/02'},
  {id: 'tk1', employee: 'tom.kowalsky', projectNames: ['projects', 'jld'], workload: 330, day: '2019/03/01'},
  {id: 'th2', employee: 'tom.kowalsky', projectNames: ['internal', 'self-dev'], workload: 480, day: '2019/03/03'}
];

const updatedResponse = {
  id: 'jd2',
  employee: 'john.doe',
  projectNames: ['projects', 'jld'],
  workload: 300,
  day: '2019/03/02'
};

describe('Reporting Page - desktop', () => {
  let httpMock: MockAdapter;
  let store: Store;

  beforeEach(() => {
    jest.spyOn(Month, 'current', 'get').mockReturnValue(new Month(2019, 3));
    httpMock = new MockAdapter(OpenTrappRestAPI.axios);
    httpMock
        .onGet(/\/api\/v1\/calendar\/2019\/\d$/)
        .reply(200, monthResponse)
        .onGet(/\/api\/v1\/calendar\/2019\/\d\/work-log\/entries$/)
        .reply(200, workLogResponse)
        .onDelete(/\/api\/v1\/work-log\/entries\/.*$/)
        .reply(204)
        .onPut('/api/v1/work-log/entries/jd2')
        .reply(200, updatedResponse);

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
      reporting: reportingInitialState()
    });
  });

  describe('filters', () => {
    it('displays month selector', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      expect(chips(wrapper, '[data-months-selector]')).toHaveLength(5);
      expect(monthChipsLabels(wrapper))
          .toEqual(['2018/12', '2019/01', '2019/02', '2019/03', '2019/04']);
    });

    it('displays tags', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      expect(chips(wrapper, '[data-projects-selector]')).toHaveLength(5);
      expect(chipsLabels(wrapper, '[data-projects-selector]').sort())
          .toEqual(['internal', 'jld', 'nvm', 'projects', 'self-dev']);
    });

    it('displays employees', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      expect(chips(wrapper, '[data-employees-selector]')).toHaveLength(2);
      expect(chipsLabels(wrapper, '[data-employees-selector]').sort())
          .toEqual(['john.doe', 'tom.kowalsky']);
    });

    it('selects current user chip by default', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      expect(selectedChipsLabels(wrapper, '[data-employees-selector]')).toEqual(['john.doe']);
    });

    it('selects current user projects by default', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      expect(selectedChipsLabels(wrapper, '[data-projects-selector]').sort()).toEqual(['nvm', 'projects']);
    });

    it('changes selected month on click', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      monthChip(wrapper, '2019/02').simulate('click');
      await flushAllPromises();

      expect(httpMock.history.get.filter(r => r.url === '/api/v1/calendar/2019/2')).toHaveLength(1);
      expect(httpMock.history.get.filter(r => r.url === '/api/v1/calendar/2019/2/work-log/entries')).toHaveLength(1);
      expect(selectedMonth(wrapper)).toEqual('2019/02');
      expect(monthChipsLabels(wrapper))
          .toEqual(['2018/12', '2019/01', '2019/02', '2019/03', '2019/04']);
    });

    it('changes tags selection on click', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      chip(wrapper, '[data-projects-selector]', 'nvm').simulate('click');

      expect(selectedChipsLabels(wrapper, '[data-projects-selector]')).toEqual(['projects']);
    });

    it('changes employees selection on click', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      chip(wrapper, '[data-employees-selector]', 'tom.kowalsky').simulate('click');

      expect(selectedChipsLabels(wrapper, '[data-employees-selector]')).toEqual(['john.doe', 'tom.kowalsky']);
    });

    it('filters workloads in tags filter by selected employees', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();
      chip(wrapper, '[data-employees-selector]', 'tom.kowalsky').simulate('click');
      chip(wrapper, '[data-employees-selector]', 'john.doe').simulate('click');

      expect(chipWorkload(wrapper, '[data-projects-selector]', 'projects')).toEqual('5h 30m');
      expect(chipWorkload(wrapper, '[data-projects-selector]', 'jld')).toEqual('5h 30m');
      expect(chipWorkload(wrapper, '[data-projects-selector]', 'self-dev')).toEqual('1d');
    });

    it('filters workloads in employees filter by selected tags', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();
      chip(wrapper, '[data-projects-selector]', 'nvm').simulate('click');
      chip(wrapper, '[data-projects-selector]', 'jld').simulate('click');

      expect(chipWorkload(wrapper, '[data-employees-selector]', 'john.doe')).toEqual('1d 7h');
      expect(chipWorkload(wrapper, '[data-employees-selector]', 'tom.kowalsky')).toEqual('5h 30m');
    });
  });

  describe('reporting - calendar', () => {
    it('calendar view is selected by default', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      expect(wrapper.find(MonthlyReport)).toHaveLength(1);
      expect(wrapper.find(TableReport)).toHaveLength(0);
      expect(wrapper.find(ProjectsReport)).toHaveLength(0);
    });
  });

  describe('reporting - table', () => {
    it('shows table view after tab click', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      tableTab(wrapper).simulate('click');

      expect(wrapper.find(TableReport)).toHaveLength(1);
      expect(wrapper.find(MonthlyReport)).toHaveLength(0);
      expect(wrapper.find(ProjectsReport)).toHaveLength(0);
    });

    it('removes work log on remove button click', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();
      tableTab(wrapper).simulate('click');

      removeWorkLogButton(wrapper, 0).simulate('click');
      await flushAllPromises();
      wrapper.update();

      expect(httpMock.history.delete).toHaveLength(1);
      expect(tableRows(wrapper)).toHaveLength(1);
    });

    it('edits work log', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();
      tableTab(wrapper).simulate('click');

      editWorkLogButton(wrapper, 0).simulate('click');
      typeExpression(wrapper, '[data-edit-work-log-workload]', '5h');
      typeExpression(wrapper, '[data-edit-work-log-project]', ' projects,jld ');
      updateButton(wrapper).simulate('click');
      await flushAllPromises();
      wrapper.update();

      expect(httpMock.history.put).toHaveLength(1);
      expect(tableRows(wrapper)).toHaveLength(2);
      expect(tableRow(wrapper, 0).find('[data-workload-cell]').at(0).text()).toEqual('5h');
      expect(tableRow(wrapper, 0).find('[data-tags-cell]').at(0).text()).toEqual('projects, jld');
    });

    function tableTab(wrapper) {
      return wrapper.find('[data-reporting-table-tab]').at(0);
    }

    function tableRows(wrapper) {
      return wrapper
          .find(TableBody).at(0)
          .find(TableRow);
    }

    function tableRow(wrapper, rowIdx: number) {
      return tableRows(wrapper)
          .at(rowIdx);
    }

    function removeWorkLogButton(wrapper, rowIdx: number) {
      return tableRow(wrapper, rowIdx).find('[data-remove-button]').at(0);
    }

    function editWorkLogButton(wrapper, rowIdx: number) {
      return tableRow(wrapper, rowIdx).find('[data-edit-button]').at(0);
    }

    function dialogInput(wrapper, selector: string) {
      return wrapper.find(Dialog)
          .find(TextField).filter(selector)
          .find('input');
    }

    function updateButton(wrapper) {
      return wrapper.find(Dialog)
          .find(Button).filter('[data-update-button]')
          .at(0);
    }

    function typeExpression(wrapper, selector: string, expression: string) {
      const input = dialogInput(wrapper, selector);
      input.simulate('change', {target: {value: expression}})
    }
  });

  describe('reporting - projects', () => {
    it('shows projects view after tab click', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      projectsTab(wrapper).simulate('click');

      expect(wrapper.find(ProjectsReport)).toHaveLength(1);
      expect(wrapper.find(TableReport)).toHaveLength(0);
      expect(wrapper.find(MonthlyReport)).toHaveLength(0);
    });

    function projectsTab(wrapper) {
      return wrapper.find('[data-reporting-projects-tab]').at(0);
    }
  });

  function chips(wrapper, selector: string): ReactWrapper {
    return wrapper.find(selector).at(0).find(Chip)
  }

  function chipsLabels(wrapper, selector: string): string[] {
    return chips(wrapper, selector).map(w => w.find('[data-chip-label]').at(0).text());
  }

  function monthChipsLabels(wrapper): string[] {
    return chips(wrapper, '[data-months-selector]').map(w => w.text());
  }

  function chip(wrapper, selector: string, label: string): ReactWrapper {
    return chips(wrapper, selector)
        .filterWhere((w: any) => w.find('[data-chip-label]').at(0).text() === label).at(0);
  }

  function monthChip(wrapper, label: string) {
    return chips(wrapper, '[data-months-selector]')
        .filterWhere(w => w.text() === label).at(0);
  }

  function selectedChips(wrapper, selector: string) {
    return chips(wrapper, selector).filter('[data-chip-selected=true]');
  }

  function selectedChipsLabels(wrapper, selector: string): string[] {
    return selectedChips(wrapper, selector).map(w => w.find('[data-chip-label]').at(0).text());
  }

  function selectedMonth(wrapper): string {
    return chips(wrapper, '[data-months-selector]')
        .filter('[data-chip-selected=true]')
        .map(w => w.text())[0];
  }

  function chipWorkload(wrapper, selector: string, label: string): string {
    return chip(wrapper, selector, label)
        .find('[data-chip-workload]')
        .at(0)
        .text();
  }
});
