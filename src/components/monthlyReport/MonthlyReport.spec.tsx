import React from 'react';
import { mount, ReactWrapper, shallow } from "enzyme";
import { MonthlyReport } from "./MonthlyReport";
import { TableHead } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';

const someMonth = [{
  id: '2018/12/01',
  weekend: true,
  holiday: false
}, {
  id: '2018/12/02',
  weekend: true,
  holiday: false
}, {
  id: '2018/12/03',
  weekend: false,
  holiday: false
}, {
  id: '2018/12/04',
  weekend: false,
  holiday: false
}, {
  id: '2018/12/05',
  weekend: false,
  holiday: false
}, {
  id: '2018/12/06',
  weekend: false,
  holiday: false
}, {
  id: '2018/12/07',
  weekend: false,
  holiday: false
}];

const singleEmployeeWorkLog = {
  'john.doe': [
    {day: '2018/12/03', workload: 480},
    {day: '2018/12/04', workload: 450},
    {day: '2018/12/04', workload: 30},
    {day: '2018/12/06', workload: 330},
    {day: '2018/12/07', workload: 0}
  ]
};

const multipleEmployeeWorklok = {
  'john.doe': [
    {day: '2018/12/03', workload: 480},
    {day: '2018/12/04', workload: 450},
    {day: '2018/12/04', workload: 30},
    {day: '2018/12/06', workload: 330},
    {day: '2018/12/07', workload: 0}
  ],
  'tom.kowalsky': [
    {day: '2018/12/03', workload: 300},
    {day: '2018/12/04', workload: 415},
  ]
};

describe('MonthlyReport', () => {
  it('renders days for specified month and single employee', () => {
    const wrapper = shallow(<MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog}/>);

    expect(headerCells(wrapper)).toHaveLength(someMonth.length + 1);
    expect(tableRows(wrapper)).toHaveLength(1);
    expect(tableRowCells(wrapper)).toHaveLength(someMonth.length + 1);
    expect(wrapper.find(TableFooter).find(TableRow)).toHaveLength(0);
  });

  it('displays day number and weekday name in header cell', () => {
    const wrapper = mount(<MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog}/>);

    expect(headerCells(wrapper).at(0).find('div').at(0).text()).toEqual('1');
    expect(headerCells(wrapper).at(0).find('div').at(1).text()).toEqual('Sat');
    expect(headerCells(wrapper).at(1).find('div').at(0).text()).toEqual('2');
    expect(headerCells(wrapper).at(1).find('div').at(1).text()).toEqual('Sun');
  });

  it('displays workload in hours', () => {
    const wrapper = mount(<MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog}/>);

    expect(tableRowCells(wrapper).at(0).text()).toEqual('');
    expect(tableRowCells(wrapper).at(1).text()).toEqual('');
    expect(tableRowCells(wrapper).at(2).text()).toEqual('8');
    expect(tableRowCells(wrapper).at(3).text()).toEqual('8');
    expect(tableRowCells(wrapper).at(4).text()).toEqual('');
    expect(tableRowCells(wrapper).at(5).text()).toEqual('5.5');
    expect(tableRowCells(wrapper).at(6).text()).toEqual('0');
  });

  it('displays total number of hours in last column', () => {
    const wrapper = mount(<MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog}/>);

    expect(headerCells(wrapper).at(someMonth.length).text()).toEqual('Total');
    expect(totalCell(wrapper).text()).toEqual('21.5');
  });

  it('displays total row if more than one employee', () => {
    const wrapper = mount(<MonthlyReport days={someMonth} workLogs={multipleEmployeeWorklok}/>);

    expect(wrapper.find(TableFooter).find(TableRow)).toHaveLength(1);
  });

  it('emits selected day', () => {
    const onSelect = jest.fn();
    const wrapper = mount(
        <MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog} onSelect={onSelect}/>
        );

    cell(wrapper, 0).simulate('click');

    expect(onSelect).toHaveBeenCalledWith(['2018/12/01']);
  });

  it('emits selected day when header cell clicked', () => {
    const onSelect = jest.fn();
    const wrapper = mount(
        <MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog} onSelect={onSelect}/>
    );

    headerCell(wrapper, 0).simulate('click');

    expect(onSelect).toHaveBeenCalledWith(['2018/12/01']);
  });

  it('emits selected days range if click with shift', () => {
    const onSelect = jest.fn();
    const wrapper = mount(
        <MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog} selectedDays={['2018/12/01']} onSelect={onSelect}/>
    );

    cell(wrapper, 1).simulate('click', {shiftKey: true});

    expect(onSelect).toHaveBeenCalledWith(['2018/12/01', '2018/12/02']);
  });

  it('emits selected days range if click in header cell with shift', () => {
    const onSelect = jest.fn();
    const wrapper = mount(
        <MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog} selectedDays={['2018/12/01']} onSelect={onSelect}/>
    );

    headerCell(wrapper, 1).simulate('click', {shiftKey: true});

    expect(onSelect).toHaveBeenCalledWith(['2018/12/01', '2018/12/02']);
  });

  it('changes previous selection', () => {
    const onSelect = jest.fn();
    const wrapper = mount(
        <MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog} selectedDays={['2018/12/02', '2018/12/03']} onSelect={onSelect}/>
    );

    cell(wrapper, 0).simulate('click');

    expect(onSelect).toHaveBeenCalledWith(['2018/12/01']);
  });

  function headerCells(wrapper): ReactWrapper {
    return wrapper.find(TableHead).find(TableRow).find(TableCell);
  }

  function tableRows(wrapper): ReactWrapper {
    return wrapper.find(TableBody).find(TableRow);
  }

  function tableRowCells(wrapper, rowIdx = 0): ReactWrapper {
    return tableRows(wrapper).at(rowIdx).find(TableCell);
  }

  function cell(wrapper, cellIdx: number): ReactWrapper {
    return tableRowCells(wrapper).at(cellIdx);
  }

  function headerCell(wrapper, cellIdx: number): ReactWrapper {
      return headerCells(wrapper).at(cellIdx);
  }

  function totalCell(wrapper): ReactWrapper {
    return cell(wrapper, someMonth.length);
  }
});
