import * as React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Month } from '../../utils/Month';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
import { setupStore } from '../../utils/testUtils';
import { initialState as registrationInitialState } from '../../redux/registration.reducer';
import { ReportingPageMobile } from './ReportingPage.mobile';
import { MemoryRouter } from 'react-router';

const workLogResponse1 = [
  {id: 'jd1', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 480, day: '2019/02/01'},
  {id: 'jd2', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 420, day: '2019/02/04'},
  {id: 'jd3', employee: 'john.doe', projectNames: ['internal'], workload: 30, day: '2019/02/04'},
  {id: 'tk1', employee: 'tom.kowalsky', projectNames: ['projects', 'jld'], workload: 330, day: '2019/02/01'},
  {id: 'th2', employee: 'tom.kowalsky', projectNames: ['internal', 'self-dev'], workload: 480, day: '2019/02/05'}
];

const workLogResponse2 = [
  {id: 'jd4', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 480, day: '2019/03/01'},
  {id: 'jd5', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 420, day: '2019/03/02'}
];

const days1 = [
  {id: '2019/02/01', weekend: false, holiday: false},
  {id: '2019/02/02', weekend: true, holiday: false},
  {id: '2019/02/03', weekend: true, holiday: false},
  {id: '2019/02/04', weekend: false, holiday: false},
  {id: '2019/02/05', weekend: false, holiday: false},
  {id: '2019/02/06', weekend: false, holiday: true}
];

const days2 = [
  {id: '2019/03/01', weekend: false, holiday: false},
  {id: '2019/03/02', weekend: false, holiday: false},
  {id: '2019/03/03', weekend: true, holiday: false}
];

const monthResponse1 = {
  id: '2019/02',
  link: '/api/v1/2019/02',
  next: '/api/v1/2019/03',
  prev: '/api/v1/2019/01',
  days: days1
};

const monthResponse2 = {
  id: '2019/03',
  link: '/api/v1/2019/03',
  next: '/api/v1/2019/04',
  prev: '/api/v1/2019/02',
  days: days2
};

describe('Reporting page - mobile', () => {
  let httpMock: MockAdapter;
  let store: Store;

  beforeEach(() => {
    jest.spyOn(Month, 'current', 'get').mockReturnValue(new Month(2019, 2));
    httpMock = new MockAdapter(OpenTrappRestAPI.axios);
    httpMock
        .onGet('/calendar/2019/2')
        .reply(200, monthResponse1)
        .onGet('/calendar/2019/3')
        .reply(200, monthResponse2)
        .onGet('/calendar/2019/2/work-log/entries')
        .reply(200, workLogResponse1)
        .onGet('/calendar/2019/3/work-log/entries')
        .reply(200, workLogResponse2);

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

  it('shows month selector', async () => {
    const {getByText, getByTestId} = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <ReportingPageMobile/>
          </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {});

    expect(getByTestId('month-selector')).toBeInTheDocument();
    expect(getByText('2019/02')).toBeInTheDocument();
  });

  it('changes selected month', async () => {
    const {getByTestId, getByText, queryAllByTestId} = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <ReportingPageMobile/>
          </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {});

    fireEvent.click(getByTestId('month-selector-next'));
    await waitFor(() => {});

    expect(getByText('2019/03')).toBeInTheDocument();
    expect(queryAllByTestId('day-card')).toHaveLength(2);
    expect(queryAllByTestId('day-card-day')[0]).toHaveTextContent('2019/03/02');
    expect(queryAllByTestId('day-card-day')[1]).toHaveTextContent('2019/03/01');
  });

  it('shows list of days with work logs sorted descending', async () => {
    const { queryAllByTestId } = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <ReportingPageMobile/>
          </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {
    });

    expect(queryAllByTestId('day-card')).toHaveLength(2);
    expect(queryAllByTestId('day-card-day')[0]).toHaveTextContent('2019/02/04');
    expect(queryAllByTestId('day-card-day')[1]).toHaveTextContent('2019/02/01');
  });
});
