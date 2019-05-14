import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { TableReport } from './TableReport';
import { ReportingWorkLog } from '../reporting.model';
import TableCell from '@material-ui/core/TableCell';
import { noop } from 'lodash';
import { TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
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
    const wrapper = mount(
      <TableReport workLogs={workLogs} onRemoveWorkLog={noop} onEditWorkLog={noop} username={username} tags={[]}/>
    );

    expect(wrapper.find(TableCell).filter('[data-day-cell]')).toHaveLength(3);
    expect(wrapper.find(TableCell).filter('[data-employee-cell]')).toHaveLength(4);
    expect(wrapper.find(TableCell).filter('[data-workload-cell]')).toHaveLength(5);
    expect(wrapper.find(TableCell).filter('[data-tags-cell]')).toHaveLength(5);
  });

  it('displays workload pretty formatted', () => {
    const wrapper = mount(
        <TableReport workLogs={workLogs} onRemoveWorkLog={noop} onEditWorkLog={noop} username={username} tags={[]}/>
    );

    expect(workloadCellsText(wrapper)).toEqual(['7h 30m', '7h', '1d', '1h', '5h 30m']);
  });

  it(`displays action buttons only for current user's entries`, () => {
    const wrapper = mount(
        <TableReport workLogs={workLogs} onRemoveWorkLog={noop} onEditWorkLog={noop} username={username} tags={[]}/>
    );

    expect(hasRowRemoveButton(row(wrapper, 0))).toBeFalsy();
    expect(hasRowEditButton(row(wrapper, 0))).toBeFalsy();
    expect(hasRowRemoveButton(row(wrapper, 1))).toBeTruthy();
    expect(hasRowEditButton(row(wrapper, 1))).toBeTruthy();
    expect(hasRowRemoveButton(row(wrapper, 2))).toBeTruthy();
    expect(hasRowEditButton(row(wrapper, 2))).toBeTruthy();
    expect(hasRowRemoveButton(row(wrapper, 3))).toBeTruthy();
    expect(hasRowEditButton(row(wrapper, 3))).toBeTruthy();
    expect(hasRowRemoveButton(row(wrapper, 4))).toBeFalsy();
    expect(hasRowEditButton(row(wrapper, 4))).toBeFalsy();
  });

  it('removes work log', () => {
    const onRemove = jest.fn();
    const wrapper = mount(
        <TableReport workLogs={workLogs} onRemoveWorkLog={onRemove} onEditWorkLog={noop} username={username} tags={[]}/>
    );

    removeWorkLogButton(wrapper, 2).simulate('click');

    expect(onRemove).toHaveBeenCalledWith('jd1');
  });

  it('displays edit dialog on button click', () => {
    const onRemove = jest.fn();
    const wrapper = mount(
        <TableReport workLogs={workLogs} onRemoveWorkLog={onRemove} onEditWorkLog={noop} username={username} tags={[]}/>
    );

    editWorkLogButton(wrapper, 2).simulate('click');

    expect(wrapper.find(DialogContent).filter('[data-edit-work-log-dialog-content]')).toHaveLength(1);
    expect(inputValue(wrapper, '[data-edit-work-log-workload]')).toEqual('1d');
    expect(inputValue(wrapper, '[data-edit-work-log-project]')).toEqual('projects, nvm');
    expect(inputValue(wrapper, '[data-edit-work-log-employee]')).toEqual('john.doe');
    expect(inputValue(wrapper, '[data-edit-work-log-date]')).toEqual('2019/03/01');
  });

  function tableRows(wrapper) {
    return wrapper
        .find(TableBody).at(0)
        .find(TableRow);
  }

  function row(wrapper, rowIdx: number): ReactWrapper {
    return tableRows(wrapper).at(rowIdx);
  }

  function workloadCellsText(wrapper) {
    return wrapper.find(TableCell).filter('[data-workload-cell]').map(w => w.text());
  }

  function removeWorkLogButton(wrapper, rowIdx: number) {
    return row(wrapper, rowIdx).find('[data-remove-button]').at(0);
  }

  function editWorkLogButton(wrapper, rowIdx: number) {
    return row(wrapper, rowIdx).find('[data-edit-button]').at(0);
  }

  function hasRowRemoveButton(row: ReactWrapper) {
    return row.find(Button).filter('[data-remove-button]').length === 1;
  }

  function hasRowEditButton(row: ReactWrapper) {
    return row.find(Button).filter('[data-edit-button]').length === 1;
  }

  function dialogInput(wrapper, selector: string) {
    return wrapper.find(DialogContent)
        .find(TextField).filter(selector)
        .find('input');
  }

  function inputValue(wrapper, selector: string) {
    return (dialogInput(wrapper, selector).instance() as any).value;
  }
});
