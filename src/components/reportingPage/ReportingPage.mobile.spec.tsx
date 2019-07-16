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

const workLogResponse = [
  {id: 'jd1', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 480, day: '2019/02/01'},
  {id: 'jd2', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 420, day: '2019/02/04'},
  {id: 'jd3', employee: 'john.doe', projectNames: ['internal'], workload: 30, day: '2019/02/04'},
  {id: 'tk1', employee: 'tom.kowalsky', projectNames: ['projects', 'jld'], workload: 330, day: '2019/02/01'},
  {id: 'th2', employee: 'tom.kowalsky', projectNames: ['internal', 'self-dev'], workload: 480, day: '2019/02/05'}
];

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

describe('Reporting page - mobile', () => {
  let httpMock: MockAdapter;
  let store: Store;

  beforeEach(() => {
    jest.spyOn(Month, 'current', 'get').mockReturnValue(new Month(2019, 2));
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
      },
      registration: registrationInitialState(),
      reporting: reportingInitialState()
    });
  });

  it('shows month selector', () => {
    // TODO
  });

  it('shows list of days with work logs sorted descending', async () => {
    const wrapper = mount(
        <Provider store={store}>
          <ReportingPageMobile/>
        </Provider>
    );
    await flushAllPromises();
    wrapper.update();

    expect(wrapper.find(DayCard)).toHaveLength(2);
    expect(cardDay(wrapper, 0)).toContain('2019/02/04');
    expect(cardDay(wrapper, 1)).toContain('2019/02/01');
  });

  it('moves to registration view on EDIT day click', async () => {
    const wrapper = mount(
        <Provider store={store}>
          <ReportingPageMobile/>
        </Provider>
    );
    await flushAllPromises();
    wrapper.update();

    editDayButton(wrapper, '2019/02/04').simulate('click');

    // TODO
  });

  function editDayButton(wrapper, day: string) {
    return wrapper.find(`[data-day-card="${day}"]`);
  }

  function cardDay(wrapper, cardIdx: number) {
    return wrapper.find(DayCard).at(cardIdx).find('[data-day-card-day]').hostNodes().text();
  }
});
