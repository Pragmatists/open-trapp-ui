import * as React from 'react';
import { render, RenderResult, within, fireEvent } from '@testing-library/react';
import { TableReport } from './TableReport';
import { ReportingWorkLog } from '../reporting.model';
import { noop } from 'lodash';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';

const workLogs: ReportingWorkLog[] = [
  {id: 'jd1', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 480, day: '2019/03/01'},
  {id: 'jd2', employee: 'john.doe', projectNames: ['internal', 'self-dev'], workload: 60, day: '2019/03/01'},
  {id: 'jd3', employee: 'john.doe', projectNames: ['projects', 'nvm'], workload: 420, day: '2019/03/02'},
  {id: 'tk1', employee: 'tom.kowalsky', projectNames: ['projects', 'jld'], workload: 330, day: '2019/03/01'},
  {id: 'tk2', employee: 'tom.kowalsky', projectNames: ['internal', 'self-dev'], workload: 450, day: '2019/03/03'}
].map(w => new ReportingWorkLog(w as any));

const username = 'john.doe';

describe('Table report', () => {
  it('displays work logs grouped by days and employees', () => {
    const {queryAllByTestId} = render(
      <TableReport workLogs={workLogs} onRemoveWorkLog={noop} onEditWorkLog={noop} username={username} tags={[]}/>
    );

    expect(queryAllByTestId('day-cell')).toHaveLength(3);
    expect(queryAllByTestId('employee-cell')).toHaveLength(4);
    expect(queryAllByTestId('workload-cell')).toHaveLength(5);
    expect(queryAllByTestId('tags-cell')).toHaveLength(5);
  });

  it('displays workload pretty formatted', () => {
    const container = render(
        <TableReport workLogs={workLogs} onRemoveWorkLog={noop} onEditWorkLog={noop} username={username} tags={[]}/>
    );

    expect(workloadCellsText(container)).toEqual(['7h 30m', '7h', '1d', '1h', '5h 30m']);
  });

  it(`displays action buttons only for current user's entries`, () => {
    const container = render(
        <TableReport workLogs={workLogs} onRemoveWorkLog={noop} onEditWorkLog={noop} username={username} tags={[]}/>
    );

    expect(row(container, 0).queryByTestId('remove-button')).not.toBeInTheDocument();
    expect(row(container, 0).queryByTestId('edit-button')).not.toBeInTheDocument();
    expect(row(container, 1).queryByTestId('remove-button')).toBeInTheDocument();
    expect(row(container, 1).queryByTestId('edit-button')).toBeInTheDocument();
    expect(row(container, 2).queryByTestId('remove-button')).toBeInTheDocument();
    expect(row(container, 2).queryByTestId('edit-button')).toBeInTheDocument();
    expect(row(container, 3).queryByTestId('remove-button')).toBeInTheDocument();
    expect(row(container, 3).queryByTestId('edit-button')).toBeInTheDocument();
    expect(row(container, 4).queryByTestId('remove-button')).not.toBeInTheDocument();
    expect(row(container, 4).queryByTestId('edit-button')).not.toBeInTheDocument();
  });

  it('removes work log', () => {
    const onRemove = jest.fn();
    const container = render(
        <TableReport workLogs={workLogs} onRemoveWorkLog={onRemove} onEditWorkLog={noop} username={username} tags={[]}/>
    );

    fireEvent.click(row(container, 2).getByTestId('remove-button'));

    expect(onRemove).toHaveBeenCalledWith('jd1');
  });

  it('displays edit dialog on button click', () => {
    const onRemove = jest.fn();
    const container = render(
        <TableReport workLogs={workLogs} onRemoveWorkLog={onRemove} onEditWorkLog={noop} username={username} tags={[]}/>
    );

    fireEvent.click(row(container, 2).getByTestId('edit-button'));

    expect(container.queryByTestId('edit-work-log-dialog-content')).toBeInTheDocument();
    expect(container.getByDisplayValue('1d')).toBeInTheDocument();
    expect(container.getByDisplayValue('projects, nvm')).toBeInTheDocument();
    expect(container.getByDisplayValue('john.doe')).toBeInTheDocument();
    expect(container.getByDisplayValue('2019/03/01')).toBeInTheDocument();
  });

  function row(container: RenderResult, rowIdx: number) {
    return within(container.queryAllByTestId('table-report-row')[rowIdx]);
  }

  function workloadCellsText(container: RenderResult) {
    return container.queryAllByTestId('workload-cell').map(w => w.textContent);
  }

  function dialogInput(wrapper, selector: string) {
    return wrapper.find(DialogContent)
        .find(TextField).filter(selector)
        .find('input');
  }
});
