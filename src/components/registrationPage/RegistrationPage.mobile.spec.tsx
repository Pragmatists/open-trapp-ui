import {fireEvent, render, RenderResult, waitFor, within} from '@testing-library/react';
import { Provider } from 'react-redux';
import * as React from 'react';
import { Store } from 'redux';
import MockAdapter from 'axios-mock-adapter';
import { chain } from 'lodash';
import { RegistrationPageMobile } from './RegistrationPage.mobile';
import { setupStore } from '../../utils/testUtils';
import { initialState as registrationInitialState } from '../../redux/registration.reducer';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
import { ReportingWorkLogDTO } from '../../api/dtos';
import userEvent from "@testing-library/user-event";

const workLogResponse: ReportingWorkLogDTO[] = [
  {id: '1', link: 'link', employee: 'john.doe', day: '2019/02/01', workload: 480, projectNames: ['projects', 'nvm']},
  {id: '2', link: 'link', employee: 'andy.barber', day: '2019/02/01', workload: 420, projectNames: ['projects', 'nvm']},
  {id: '3', link: 'link', employee: 'john.doe', day: '2019/02/04', workload: 450, projectNames: ['projects', 'nvm']},
  {id: '4', link: 'link', employee: 'john.doe', day: '2019/02/04', workload: 30, projectNames: ['internal', 'standup']},
  {id: '5', link: 'link', employee: 'andy.barber', day: '2019/02/01', workload: 390, projectNames: ['projects', 'nvm']},
  {id: '6', link: 'link', employee: 'andy.barber', day: '2019/02/01', workload: 30, projectNames: ['internal', 'self-dev']},
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
        .onGet(/\/calendar\/2019\/\d\/work-log\/entries$/)
        .reply(200, workLogResponse)
        .onGet('/projects/presets')
        .reply(200, presetsResponse)
        .onGet(/\/projects.*/)
        .reply(200, tagsResponse)
        .onPost('/employee/john.doe/work-log/entries')
        .reply(201, {id: '123-456'})
        .onDelete(/\/work-log\/entries\/.*$/)
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

  describe('day selector', () => {
    it('current day is selected by default', async () => {
      const today = '04.02.2019';
      const {getByText} = render(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );

      expect(getByText(today)).toBeVisible();
    });

    it('changes date on right arrow click', async () => {
      const tomorrow = '05.02.2019';
      const {getByText, getByTestId} = render(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );

      fireEvent.click(getByTestId('day-selector-next'));

      expect(getByText(tomorrow)).toBeVisible();
    });

    it('changes date on left arrow click', async () => {
      const yesterday = '03.02.2019';
      const {getByText, getByTestId} = render(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );

      fireEvent.click(getByTestId('day-selector-previous'));

      expect(getByText(yesterday)).toBeVisible();
    });
  });

  describe('reported work logs', () => {
    it('displays reported work logs', async () => {
      const container = render(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );

      await waitFor(() => expect(container.queryAllByTestId('work-log')).toHaveLength(2));
    });

    it('deletes work log', async () => {
      const container = render(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );
      await waitFor(() => {});

      fireEvent.click(container.queryAllByTestId('work-log')[0].lastChild);

      await waitFor(() => expect(httpMock.history.delete).toHaveLength(1));
      expect(httpMock.history.delete[0].url).toEqual('/work-log/entries/3');
      expect(container.queryAllByTestId('work-log')).toHaveLength(1);
    });
  });

  describe('presets selector', () => {
    it('displays list of presets', async () => {
      const container = render(
          <Provider store={store}>
            <RegistrationPageMobile/>
          </Provider>
      );

      await waitFor(() => expect(presets(container)).toHaveLength(2));
      expect(presets(container)[0]).toHaveTextContent('vacation');
      expect(presets(container)[1]).toHaveTextContent('projects, nvm');
    });
  });

  it('registers work log for existing preset', async () => {
    const container = render(
        <Provider store={store}>
          <RegistrationPageMobile/>
        </Provider>
    );
    await waitFor(() => {});

    fireEvent.click(presets(container)[0]);
    fireEvent.click(container.getByRole('button', {name: 'Save'}));

    await waitFor(() => expect(httpMock.history.post.length).toEqual(1));
    expect(JSON.parse(httpMock.history.post[0].data)).toEqual({
      projectNames: ['vacation'],
      workload: '1d',
      day: '2019/02/04'
    });
  });

  it('registers work log for custom tags', async () => {
    const container = render(
        <Provider store={store}>
          <RegistrationPageMobile/>
        </Provider>
    );
    await waitFor(() => {});

    fireEvent.click(container.getByTestId('custom-work-log-button'));
    fireEvent.click(container.getByText('nvm'));
    fireEvent.click(container.getByRole('button', {name: 'Next'}));
    fireEvent.click(container.getByRole('button', {name: 'Save'}));

    await waitFor(() => expect(httpMock.history.post.length).toEqual(1));
    expect(JSON.parse(httpMock.history.post[0].data)).toEqual({
      projectNames: ['nvm'],
      workload: '1d',
      day: '2019/02/04'
    });
  });

  it('registers self-dev', async () => {
    const container = render(
        <Provider store={store}>
          <RegistrationPageMobile/>
        </Provider>
    );
    await waitFor(() => {});

    fireEvent.click(container.getByTestId('custom-work-log-button'));
    fireEvent.click(container.getByText('self-dev'));
    fireEvent.click(container.getByRole('button', {name: 'Next'}));
    userEvent.type(within(container.getByLabelText('self-dev description')).getByRole('textbox'), 'Some description');
    fireEvent.click(container.getByRole('button', {name: 'Save'}));

    await waitFor(() => expect(httpMock.history.post.length).toEqual(1));
    expect(JSON.parse(httpMock.history.post[0].data)).toEqual({
      projectNames: ['self-dev'],
      workload: '1d',
      day: '2019/02/04',
      note: 'Some description'
    });
  })

  it('shows tags list after cancel and reopen', async () => {
    const container = render(
        <Provider store={store}>
          <RegistrationPageMobile/>
        </Provider>
    );
    await waitFor(() => {});

    fireEvent.click(container.getByTestId('custom-work-log-button'));
    fireEvent.click(container.getByText('nvm'));
    fireEvent.click(container.getByRole('button', {name: 'Next'}));
    fireEvent.click(container.getByRole('button', {name: 'Cancel'}));
    fireEvent.click(container.getByTestId('custom-work-log-button'));

    expect(customTags(container)).toHaveLength(6);
  })

  function presets(container: RenderResult) {
    return container.queryAllByTestId('preset');
  }

  function customTags(container: RenderResult) {
    return container.queryAllByTestId('tag');
  }
});
