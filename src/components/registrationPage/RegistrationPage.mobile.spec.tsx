import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import * as React from 'react';
import { Store } from 'redux';
import MockAdapter from 'axios-mock-adapter';
import { chain } from 'lodash';
import { RegistrationPageMobile } from './RegistrationPage.mobile';
import { flushAllPromises, setupStore } from '../../utils/testUtils';
import { initialState as registrationInitialState } from '../../redux/registration.reducer';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
import { ListItem } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import { LocalStorage } from '../../utils/LocalStorage';
import { WorkLogs } from './workLogs/WorkLogs';
import { ReportingWorkLogDTO } from '../../api/dtos';

const workLogResponse: ReportingWorkLogDTO[] = [
  {id: '1', link: 'link', employee: 'john.doe', day: '2019/02/01', workload: 480, projectNames: ['projects', 'nvm']},
  {id: '2', link: 'link', employee: 'andy.barber', day: '2019/02/01', workload: 420, projectNames: ['projects', 'nvm']},
  {id: '3', link: 'link', employee: 'john.doe', day: '2019/02/04', workload: 450, projectNames: ['projects', 'nvm']},
  {id: '4', link: 'link', employee: 'john.doe', day: '2019/02/04', workload: 30, projectNames: ['internal', 'standup']},
  {id: '5', link: 'link', employee: 'andy.barber', day: '2019/02/01', workload: 390, projectNames: ['projects', 'nvm']},
  {id: '6', link: 'link', employee: 'andy.barber', day: '2019/02/01', workload: 30, projectNames: ['internal', 'standup']},
  {id: '7', link: 'link', employee: 'andy.barber', day: '2019/02/04', workload: 0, projectNames: ['remote']}
];

const tagsResponse = chain(workLogResponse)
    .map(r => r.projectNames)
    .flatten()
    .uniq()
    .value();

const presetsResponse = [
    ['vacation'],
    ['projects', 'nvm']
];

describe('Registration Page - mobile', () => {
  let httpMock: MockAdapter;
  let store: Store;

  beforeEach(() => {
    httpMock = new MockAdapter(OpenTrappRestAPI.axios);
    httpMock
        .onGet(/\/api\/v1\/calendar\/2019\/\d\/work-log\/entries$/)
        .reply(200, workLogResponse)
        .onGet('/api/v1/projects')
        .reply(200, tagsResponse)
        .onGet('/api/v1/projects/presets')
        .reply(200, presetsResponse)
        .onPost('/api/v1/employee/john.doe/work-log/entries')
        .reply(201, {id: '123-456'})
        .onDelete(/\/api\/v1\/work-log\/entries\/.*$/)
        .reply(204);
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
      registration: registrationInitialState({days: ['2019/02/04']})
    });
  });

  afterEach(() => {
    localStorage.removeItem(LocalStorage.PRESETS_KEY);
  });

  describe('day selector', () => {
    it('current day is selected by default', async () => {
      const today = '04.02.2019';
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );
      await flushAllPromises();

      expect(date(wrapper)).toEqual(today);
    });

    it('changes date on right arrow click', async () => {
      const tomorrow = '05.02.2019';
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );
      await flushAllPromises();

      nextDayButton(wrapper).simulate('click');
      await flushAllPromises();

      expect(date(wrapper)).toEqual(tomorrow);
    });

    it('changes date on left arrow click', async () => {
      const yesterday = '03.02.2019';
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );
      await flushAllPromises();

      previousDayButton(wrapper).simulate('click');
      await flushAllPromises();

      expect(date(wrapper)).toEqual(yesterday);
    });
  });

  describe('reported work logs', () => {
    it('displays reported work logs', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      expect(wrapper.find(WorkLogs).find('[data-work-log]').hostNodes()).toHaveLength(2);
    });

    it('deletes work log', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      wrapper.find('[data-work-log]').at(0).find('svg').simulate('click');
      await flushAllPromises();
      wrapper.update();

      expect(wrapper.find(WorkLogs).find('[data-work-log]').hostNodes()).toHaveLength(1);
      expect(httpMock.history.delete).toHaveLength(1);
      expect(httpMock.history.delete[0].url).toEqual('/api/v1/work-log/entries/3');
    });
  });

  describe('presets selector', () => {
    it('displays list of presets', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );
      await flushAllPromises();
      wrapper.update();

      expect(presets(wrapper)).toHaveLength(2);
      expect(presets(wrapper).at(0).text()).toEqual('vacation');
      expect(presets(wrapper).at(1).text()).toEqual('projects, nvm');
    });
  });

  it('registers work log for existing preset', async () => {
    const wrapper = mount(
        <Provider store={store}>
          <RegistrationPageMobile/>
        </Provider>
    );
    await flushAllPromises();
    wrapper.update();

    preset(wrapper, 0).simulate('click');
    saveWorkLogButton(wrapper).simulate('click');
    await flushAllPromises();

    expect(httpMock.history.post.length).toEqual(1);
    expect(JSON.parse(httpMock.history.post[0].data)).toEqual({
      projectNames: ['vacation'],
      workload: '8h',
      day: '2019/02/04'
    });
  });

  function date(wrapper): string {
    return wrapper.find('[data-selector-date]').text();
  }

  function nextDayButton(wrapper): ReactWrapper {
    return wrapper.find('[data-selector-next]').at(0);
  }

  function previousDayButton(wrapper): ReactWrapper {
    return wrapper.find('[data-selector-previous]').at(0);
  }

  function presets(wrapper) {
    return wrapper.find('[data-presets-selector-list]').find(Chip).filter('[data-preset]')
  }

  function preset(wrapper, chipIdx: number) {
    return presets(wrapper).at(chipIdx);
  }

  function saveWorkLogButton(wrapper) {
    return wrapper.find('[data-workload-dialog]').find(DialogActions).find(Button).filter('[data-save-button]');
  }
});
