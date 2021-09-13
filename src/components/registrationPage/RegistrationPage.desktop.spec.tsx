import * as React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { chain } from 'lodash';
import { fireEvent, render, RenderResult, waitFor, within } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { ignoreHtmlTags, setupStore } from '../../utils/testUtils';
import { RegistrationPageDesktop } from './RegistrationPage.desktop';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
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
        .onGet(/\/calendar\/2019\/\d$/)
        .reply(200, monthResponse)
        .onGet(/\/calendar\/2019\/\d\/work-log\/entries$/)
        .reply(200, workLogResponse)
        .onGet('/projects')
        .reply(200, tagsResponse)
        .onGet('/projects/presets')
        .reply(200, [])
        .onPost('/employee/john.doe/work-log/entries')
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
      const {findByText} = render(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );

      expect(await findByText(ignoreHtmlTags('2019/02 month worklog'))).toBeInTheDocument();
    });

    it('fetches and renders days with workload for current month', async () => {
      const container = render(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );

      await waitFor(() => expect(httpMock.history.get.filter(r => r.url.startsWith('/calendar'))).toHaveLength(2));
      expect(container.getByTestId('monthly-report')).toBeInTheDocument() ;
      expect(container.queryAllByTestId('month-day-header')).toHaveLength(days.length);
      expect(tableRowCells(container, 0)).toHaveLength(days.length);
      expect(tableRowCells(container, 0)[0]).toHaveTextContent('8');
      expect(tableRowCells(container, 0)[1]).toHaveTextContent('');
      expect(tableRowCells(container, 0)[2]).toHaveTextContent('');
      expect(tableRowCells(container, 0)[3]).toHaveTextContent('8');
      expect(totalCell(container, 0)).toHaveTextContent('16');
    });

    it('reloads data on NEXT month click', async () => {
      const { getByText, getByTestId } = render(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );
      await waitFor(() => {});

      fireEvent.click(getByText('Next'));

      await waitFor(() => expect(httpMock.history.get.filter(r => r.url.startsWith('/calendar'))).toHaveLength(4));
      expect(getByTestId('monthly-report')).toBeInTheDocument();
      expect(getByText(ignoreHtmlTags('2019/03 month worklog'))).toBeInTheDocument();
    });

    it('reloads data on PREVIOUS month click', async () => {
      const {getByText, getByTestId} = render(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );
      await waitFor(() => {});

      fireEvent.click(getByText('Previous'));

      await waitFor(() => expect(httpMock.history.get.filter(r => r.url.startsWith('/calendar'))).toHaveLength(4));
      expect(getByTestId('monthly-report')).toBeInTheDocument();
      expect(getByText(ignoreHtmlTags('2019/01 month worklog'))).toBeInTheDocument();
    });

    it('adds day to work log expression on day click', async () => {
      const container = render(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );
      await waitFor(() => {});

      fireEvent.click(dayCell(container, 0));

      expect(container.getByDisplayValue('@2019/02/01')).toBeInTheDocument();
    });

    it('modifies work log expression on day range click', async () => {
      const container = render(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );
      await waitFor(() => {});

      typeExpression(container, '1d @2019/02/03 #holiday');

      fireEvent.click(dayCell(container, 0), {shiftKey: true});

      expect(container.getByDisplayValue('1d @2019/02/01~@2019/02/03 #holiday')).toBeInTheDocument();
    });

    function tableRowCells(container: RenderResult, rowIdx: number) {
      return within(container.queryAllByTestId('employee-row')[rowIdx]).queryAllByTestId('month-day-value');
    }

    function dayCell(wrapper, dayIndex: number) {
      return tableRowCells(wrapper, 0)[dayIndex];
    }

    function totalCell(container: RenderResult, rowIdx: number) {
      return within(container.queryAllByTestId('employee-row')[rowIdx]).getByTestId('month-total-value');
    }
  });

  describe('Work log input', () => {
    it('fetches tags', async () => {
      render(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );

      await waitFor(() => expect(httpMock.history.get.filter(r => r.url === '/projects')).toHaveLength(1));
      expect(store.getState().workLog.tags).toEqual(tagsResponse);
    });

    it('saves valid work log on enter', async () => {
      const container = render(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );
      await waitFor(() => {});

      typeExpression(container, '1d #projects #nvm @2019/02/27');
      pressEnter(container);

      await waitFor(() => expect(httpMock.history.post).toHaveLength(1));
      expect(JSON.parse(httpMock.history.post[0].data)).toEqual({
        projectNames: ['projects', 'nvm'],
        workload: '1d',
        day: '2019/02/27'
      });
    });

    it('saves work log with dates range on enter', async () => {
      const container = render(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );
      await waitFor(() => {});

      typeExpression(container, '1d #projects #nvm @2019/02/27~@2019/02/28');
      pressEnter(container);

      await waitFor(() => expect(httpMock.history.post).toHaveLength(2));
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

    it('saves self-dev work log with description', async () => {
      const container = render(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );
      await waitFor(() => {});

      typeExpression(container, '1d #internal #self-dev @2019/02/27');
      pressEnter(container);
      userEvent.type(within(container.getByLabelText('self-dev description')).getByRole('textbox'), 'Some self-dev description');
      userEvent.click(container.getByRole('button', { name: 'Confirm' }));

      await waitFor(() => expect(httpMock.history.post).toHaveLength(1));
      expect(JSON.parse(httpMock.history.post[0].data)).toEqual({
        projectNames: ['internal', 'self-dev'],
        workload: '1d',
        day: '2019/02/27',
        note: 'Some self-dev description'
      });
    })

    it('reloads work logs after save', async () => {
      const container = render(
          <Provider store={store}>
            <RegistrationPageDesktop/>
          </Provider>
      );
      await waitFor(() => {});

      typeExpression(container, '1d #projects #nvm @2019/02/27');
      pressEnter(container);
      await waitFor(() => {});

      expect(httpMock.history.get.filter(r => r.url === '/calendar/2019/2/work-log/entries')).toHaveLength(2);
    });

    function pressEnter(wrapper) {
      fireEvent.keyPress(workLogInput(wrapper), {key: 'Enter', keyCode: 13});
    }
  });

  function workLogInput(container: RenderResult) {
    return within(container.getByRole('combobox')).getByRole('textbox');
  }

  function typeExpression(container: RenderResult, expression: string) {
    fireEvent.change(workLogInput(container), {target: {value: expression}});
  }
});
