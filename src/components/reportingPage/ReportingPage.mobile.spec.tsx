import * as React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { mount } from 'enzyme';
import { Month } from '../../utils/Month';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
import { flushAllPromises, setupStore } from '../../utils/testUtils';
import { initialState as registrationInitialState } from '../../redux/registration.reducer';
import { initialState as reportingInitialState } from '../../redux/reporting.reducer';
import { ReportingPageMobile } from './ReportingPage.mobile';
import { DayCard } from './dayCard/DayCard';
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

const TestComponent = () => (
  <div>Test component</div>
);

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
      registration: registrationInitialState(),
      reporting: reportingInitialState()
    });
  });

  it('shows month selector', async () => {
    const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <ReportingPageMobile/>
          </MemoryRouter>
        </Provider>
    );
    await flushAllPromises();
    wrapper.update();

    expect(monthSelector(wrapper)).toHaveLength(1);
    expect(monthSelector(wrapper).find('[data-month-selector-month]').text()).toEqual('2019/02');
  });

  it('changes selected month', async () => {
    const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <ReportingPageMobile/>
          </MemoryRouter>
        </Provider>
    );
    await flushAllPromises();
    wrapper.update();

    nextMonthButton(wrapper).simulate('click');
    await flushAllPromises();
    wrapper.update();

    expect(monthSelector(wrapper).find('[data-month-selector-month]').text()).toEqual('2019/03');
    expect(wrapper.find(DayCard)).toHaveLength(2);
    expect(cardDay(wrapper, 0)).toContain('2019/03/02');
    expect(cardDay(wrapper, 1)).toContain('2019/03/01');
  });

  it('shows list of days with work logs sorted descending', async () => {
    const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <ReportingPageMobile/>
          </MemoryRouter>
        </Provider>
    );
    await flushAllPromises();
    wrapper.update();

    expect(wrapper.find(DayCard)).toHaveLength(2);
    expect(cardDay(wrapper, 0)).toContain('2019/02/04');
    expect(cardDay(wrapper, 1)).toContain('2019/02/01');
  });

  function cardDay(wrapper, cardIdx: number) {
    return wrapper.find(DayCard).at(cardIdx).find('[data-day-card-day]').hostNodes().text();
  }

  function monthSelector(wrapper) {
    return wrapper.find('[data-month-selector]');
  }

  function nextMonthButton(wrapper) {
    return monthSelector(wrapper).find('[data-month-selector-next]').hostNodes();
  }
});
