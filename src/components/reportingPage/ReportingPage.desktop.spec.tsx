import MockAdapter from 'axios-mock-adapter';
import { Store } from 'redux';
import { OpenTrappRestAPI } from '../../api/OpenTrappAPI';
import { setupStore } from '../../utils/testUtils';
import { initialState as registrationInitialState } from '../../redux/registration.reducer';
import { fireEvent, render, RenderResult, waitFor, within } from '@testing-library/react';
import * as React from 'react';
import { Provider } from 'react-redux';
import { ReportingPageDesktop } from './ReportingPage.desktop';
import { Month } from '../../utils/Month';

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
        .onGet(/\/calendar\/2019\/\d$/)
        .reply(200, monthResponse)
        .onGet(/\/calendar\/2019\/\d\/work-log\/entries$/)
        .reply(200, workLogResponse)
        .onDelete(/\/work-log\/entries\/.*$/)
        .reply(204)
        .onPut('/work-log/entries/jd2')
        .reply(200, updatedResponse)
        .onGet('/projects')
        .reply(200, [])
        .onGet(/\/work-log\/bulk-update\/.*$/)
        .reply(200, {entriesAffected: 1})
        .onPost('/work-log/bulk-update')
        .reply(200, {entriesAffected: 1})
        .onGet('/calendar/2019/3/work-log/entries')
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
      registration: registrationInitialState()
    });
  });

  describe('filters', () => {
    it('displays month selector', async () => {
      const container = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});

      expect(monthChipsLabels(container))
          .toEqual(['2018/12', '2019/01', '2019/02', '2019/03', '2019/04']);
    });

    it('displays tags', async () => {
      const wrapper = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});

      expect(chipsLabels(wrapper, 'projects-selector').sort())
          .toEqual(['internal', 'jld', 'nvm', 'projects', 'self-dev']);
    });

    it('displays employees', async () => {
      const wrapper = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});

      expect(chipsLabels(wrapper, 'employees-selector').sort())
          .toEqual(['john.doe', 'tom.kowalsky']);
    });

    it('selects current user chip by default', async () => {
      const container = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});

      expect(selectorChipByLabel(container, 'john.doe')).toHaveAttribute('data-chip-selected', "true");
    });

    it('selects current user projects by default', async () => {
      const container = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});

      expect(selectorChipByLabel(container, 'nvm')).toHaveAttribute('data-chip-selected', "true");
      expect(selectorChipByLabel(container, 'projects')).toHaveAttribute('data-chip-selected', "true");
    });

    it('changes selected month on click', async () => {
      const container = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});

      fireEvent.click(container.getByText('2019/02'));

      await waitFor(() => expect(httpMock.history.get.filter(r => r.url === '/calendar/2019/2')).toHaveLength(1));
      expect(httpMock.history.get.filter(r => r.url === '/calendar/2019/2/work-log/entries')).toHaveLength(1);
      expect(container.getByText('2019/02').parentElement).toHaveAttribute('data-chip-selected', "true");
      expect(monthChipsLabels(container))
          .toEqual(['2018/12', '2019/01', '2019/02', '2019/03', '2019/04']);
    });

    it('changes tags selection on click', async () => {
      const container = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});

      fireEvent.click(container.getByText('nvm'));

      expect(selectorChipByLabel(container, 'projects')).toHaveAttribute('data-chip-selected', "true");
      expect(selectorChipByLabel(container, 'nvm')).not.toHaveAttribute('data-chip-selected', "true");
    });

    it('changes employees selection on click', async () => {
      const container = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});

      fireEvent.click(container.getByText('tom.kowalsky'));

      expect(selectorChipByLabel(container, 'john.doe')).toHaveAttribute('data-chip-selected', "true");
      expect(selectorChipByLabel(container, 'tom.kowalsky')).toHaveAttribute('data-chip-selected', "true");
    });

    it('filters workloads in tags filter by selected employees', async () => {
      const container = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});

      fireEvent.click(selectorChipByLabel(container, 'tom.kowalsky'));
      fireEvent.click(selectorChipByLabel(container, 'john.doe'));

      expect(within(selectorChipByLabel(container, 'projects')).getByText('5h 30m')).toBeInTheDocument();
      expect(within(selectorChipByLabel(container, 'jld')).getByText('5h 30m')).toBeInTheDocument();
      expect(within(selectorChipByLabel(container, 'self-dev')).getByText('1d')).toBeInTheDocument();
    });

    it('filters workloads in employees filter by selected tags', async () => {
      const container = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});

      fireEvent.click(selectorChipByLabel(container, 'nvm'));
      fireEvent.click(selectorChipByLabel(container, 'jld'));

      expect(within(selectorChipByLabel(container, 'john.doe')).getByText('1d 7h')).toBeInTheDocument();
      expect(within(selectorChipByLabel(container, 'tom.kowalsky')).getByText('5h 30m')).toBeInTheDocument();
    });
  });

  describe('reporting - calendar', () => {
    it('calendar view is selected by default', async () => {
      const {getByTestId, queryByTestId} = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});

      expect(queryByTestId('projects-report')).not.toBeInTheDocument();
      expect(queryByTestId('table-report')).not.toBeInTheDocument();
      expect(getByTestId('monthly-report')).toBeInTheDocument();
    });
  });

  describe('reporting - table', () => {
    it('shows table view after tab click', async () => {
      const {getByTestId, queryByTestId} = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});

      fireEvent.click(getByTestId('table-tab'));

      expect(queryByTestId('projects-report')).not.toBeInTheDocument();
      expect(getByTestId('table-report')).toBeInTheDocument();
      expect(queryByTestId('monthly-report')).not.toBeInTheDocument();
    });

    it('removes work log on remove button click', async () => {
      const container = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});
      fireEvent.click(container.getByTestId('table-tab'));

      fireEvent.click(removeWorkLogButton(container, 0));
      await waitFor(() => {});

      expect(httpMock.history.delete).toHaveLength(1);
      expect(tableRows(container)).toHaveLength(1);
    });

    it('edits work log', async () => {
      const container = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});
      fireEvent.click(container.getByTestId('table-tab'));

      fireEvent.click(within(tableRow(container, 0)).getByTestId('edit-button'));
      typeExpression(container, 'edit-workload', '5h');
      typeExpression(container, 'edit-project', ' projects,jld ');
      fireEvent.click(container.getByText('Update'));
      await waitFor(() => {});

      expect(httpMock.history.put).toHaveLength(1);
      expect(tableRows(container)).toHaveLength(2);
      expect(within(tableRow(container, 0)).getByText('5h')).toBeInTheDocument();
      expect(within(tableRow(container, 0)).getByText('projects, jld')).toBeInTheDocument();
    });

    function tableRows(container: RenderResult) {
      return container.queryAllByTestId('table-report-row');
    }

    function tableRow(container: RenderResult, rowIdx: number) {
      return tableRows(container)[rowIdx];
    }

    function removeWorkLogButton(container: RenderResult, rowIdx: number) {
      return within(tableRow(container, rowIdx)).getByTestId('remove-button');
    }

    function dialogInput(container: RenderResult, selector: string) {
      return container.getByTestId(selector).lastChild.lastChild;
    }

    function typeExpression(container: RenderResult, selector: string, expression: string) {
      fireEvent.change(dialogInput(container, selector), {target: {value: expression}});
    }
  });

  describe('reporting - projects', () => {
    it('shows projects view after tab click', async () => {
      const {getByTestId, queryByTestId} = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});

      fireEvent.click(getByTestId('projects-tab'));

      expect(getByTestId('projects-report')).toBeInTheDocument();
      expect(queryByTestId('table-report')).not.toBeInTheDocument();
      expect(queryByTestId('monthly-report')).not.toBeInTheDocument();
    });
  });

  describe('bulk edit', () => {
    it('updates entries on UPDATE button click', async () => {
      const container = render(
          <Provider store={store}>
            <ReportingPageDesktop />
          </Provider>
      );
      await waitFor(() => {});

      fireEvent.click(container.getByText('Bulk edit'));

      typeQuery(container, '@2019/03 #projects #nvm *john.doe');
      typeExpression(container, '-#nvm +#jld');
      fireEvent.click(container.getByText('Update'));
      await waitFor(() => {});

      expect(httpMock.history.post.length).toEqual(1);
      expect(httpMock.history.post[0].url).toEqual('/work-log/bulk-update');
      expect(JSON.parse(httpMock.history.post[0].data)).toEqual({
        query: '@2019/03 #projects #nvm *john.doe',
        expression: '-#nvm +#jld'
      });
    });

    function typeQuery(container: RenderResult, query: string) {
      const queryInput = container.getByTestId('bulk-edit-query').lastChild.firstChild;
      fireEvent.change(queryInput, {target: {value: query}});
    }

    function typeExpression(container: RenderResult, expression: string) {
      const expressionInput = container.getByTestId('bulk-edit-expression').lastChild.firstChild;
      fireEvent.change(expressionInput, {target: {value: expression}});
    }
  });

  function chips(container: RenderResult, selector: string) {
    return within(container.getByTestId(selector)).queryAllByTestId('selector-chip');
  }

  function chipsLabels(container: RenderResult, selector: string): string[] {
    return chips(container, selector).map(w => within(w).queryByTestId('selector-chip-label').textContent);
  }

  function monthChipsLabels(container: RenderResult): string[] {
    return container.queryAllByTestId('month-chip').map(w => w.textContent);
  }

  function selectorChipByLabel(container: RenderResult, label: string) {
    const matchingLabels = container.queryAllByText(label)
        .filter(c => c.getAttribute('data-testid') === 'selector-chip-label');
    return matchingLabels[0].parentElement.parentElement.parentElement;
  }
});
