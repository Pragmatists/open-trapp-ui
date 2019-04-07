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
import moment from 'moment';
import { ListItem } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

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

describe('Registration Page - mobile', () => {
  let httpMock: MockAdapter;
  let store: Store;

  beforeEach(() => {
    httpMock = new MockAdapter(OpenTrappRestAPI.axios);
    httpMock
        .onGet(/\/api\/v1\/calendar\/2019\/\d\/work-log\/entries$/)
        .reply(200, workLogResponse)
        .onGet('/api/v1/projects')
        .reply(200, tagsResponse);
    store = setupStore({
      authentication: {
        loggedIn: true,
        user: {
          name: 'john.doe'
        }
      },
      registration: registrationInitialState()
    });
  });

  describe('day selector', () => {
    it('current day is selected by default', async () => {
      const today = moment().format('DD.MM.YYYY');
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );
      await flushAllPromises();

      expect(date(wrapper)).toEqual(today);
    });

    it('changes date on right arrow click', async () => {
      const tomorrow = moment().add(1, 'days').format('DD.MM.YYYY');
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
      const yesterday = moment().subtract(1, 'days').format('DD.MM.YYYY');
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

  describe('presets selector', () => {
    it('creates preset', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );
      await flushAllPromises();

      addPresetButton(wrapper).simulate('click');
      tag(wrapper, 'projects').simulate('click');
      tag(wrapper, 'nvm').simulate('click');
      savePresetButton(wrapper).simulate('click');

      expect(presets(wrapper)).toHaveLength(1);
      expect(presets(wrapper).at(0).text()).toEqual('projects, nvm');
    });

    it('deletes preset', async () => {
      const wrapper = mount(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );
      await flushAllPromises();
      addPresetButton(wrapper).simulate('click');
      tag(wrapper, 'projects').simulate('click');
      savePresetButton(wrapper).simulate('click');

      deletePresetIcon(wrapper, 0).simulate('click');

      expect(presets(wrapper)).toHaveLength(0);
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

  function addPresetButton(wrapper) {
    return wrapper.find(Fab).filter('[data-create-preset-button]');
  }

  function tag(wrapper, label: string) {
    return wrapper.find(DialogContent).find(ListItem).filter(`[data-tag="${label}"]`);
  }

  function savePresetButton(wrapper) {
    return wrapper.find(DialogActions).find(Button).filter('[data-save-button]');
  }

  function presets(wrapper) {
    return wrapper.find('[data-presets-selector-list]').find(Chip).filter('[data-preset]')
  }

  function deletePresetIcon(wrapper, chipIdx: number) {
    return presets(wrapper).at(chipIdx).find('svg');
  }
});
