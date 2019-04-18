import MockAdapter from 'axios-mock-adapter';
import { Store } from 'redux';
import { Month } from '../../utils/Month';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
import { flushAllPromises, setupStore } from '../../utils/testUtils';
import { initialState as registrationInitialState } from '../../redux/registration.reducer';
import { initialState as reportingInitialState } from '../../redux/reporting.reducer';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as React from 'react';
import { ReportingPageMobile } from './ReportingPage.mobile';
import { MobileWorkLog } from './mobileWorkLog/MobileWorkLog';

const workLogResponse = [
  {id: 'jd1', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 480, day: '2019/03/01'},
  {id: 'jd2', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 420, day: '2019/03/02'},
  {id: 'tk1', employee: 'tom.kowalsky', projectNames: ['projects', 'jld'], workload: 330, day: '2019/03/01'},
  {id: 'th2', employee: 'tom.kowalsky', projectNames: ['internal', 'self-dev'], workload: 480, day: '2019/03/03'}
];

describe('Reporting page - mobile', () => {
  let httpMock: MockAdapter;
  let store: Store;

  beforeEach(() => {
    jest.spyOn(Month, 'current', 'get').mockReturnValue(new Month(2019, 3));
    httpMock = new MockAdapter(OpenTrappRestAPI.axios);
    httpMock
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
          month: 3
        }
      },
      registration: registrationInitialState(),
      reporting: reportingInitialState()
    });
  });

  it('shows month selector', () => {

  });

  it('shows list of worklogs', async () => {
    const wrapper = mount(
        <Provider store={store}>
          <ReportingPageMobile />
        </Provider>
    );
    await flushAllPromises();
    wrapper.update();

    expect(wrapper.find(MobileWorkLog)).toHaveLength(2);
  });
});
