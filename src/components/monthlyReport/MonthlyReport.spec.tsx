import React from 'react';
import { render, RenderResult, within, fireEvent } from '@testing-library/react';
import { MonthlyReport } from "./MonthlyReport";

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
    {day: '2018/12/04', workload: 10},
    {day: '2018/12/06', workload: 330},
    {day: '2018/12/07', workload: 0}
  ]
};

const multipleEmployeeWorklog = {
  'john.doe': [
    {day: '2018/12/03', workload: 480},
    {day: '2018/12/04', workload: 450},
    {day: '2018/12/04', workload: 30},
    {day: '2018/12/06', workload: 330},
    {day: '2018/12/07', workload: 0}
  ],
  'tom.kowalsky': [
    {day: '2018/12/03', workload: 300},
    {day: '2018/12/04', workload: 415}
  ]
};

describe('MonthlyReport', () => {
  it('renders days for specified month and single employee', () => {
    const container = render(<MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog}/>);

    expect(headerCells(container)).toHaveLength(someMonth.length);
    expect(container.getByText('Total')).toBeInTheDocument()
    expect(tableRows(container)).toHaveLength(1);
    expect(tableRowCells(container)).toHaveLength(someMonth.length);
    expect(container.queryByTestId('month-total-value')).toBeInTheDocument();
    expect(container.queryAllByTestId('table-footer-row')).toHaveLength(0);
  });

  it('displays day number and weekday name in header cell', () => {
    const container = render(<MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog}/>);

    expect(headerCells(container)[0]).toHaveTextContent('1Sat');
    expect(headerCells(container)[1]).toHaveTextContent('2Sun');
  });

  it('displays workload in hours', () => {
    const container = render(<MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog}/>);

    expect(tableRowCells(container)[0]).toHaveTextContent('');
    expect(tableRowCells(container)[1]).toHaveTextContent('');
    expect(tableRowCells(container)[2].textContent).toEqual('8');
    expect(tableRowCells(container)[3].textContent).toEqual('7.67');
    expect(tableRowCells(container)[4]).toHaveTextContent('');
    expect(tableRowCells(container)[5].textContent).toEqual('5.5');
    expect(tableRowCells(container)[6].textContent).toEqual('0');
  });

  it('displays total number of hours in last column', () => {
    const {getByText, getByTestId} = render(<MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog}/>);

    expect(getByText('Total')).toBeInTheDocument();
    expect(getByTestId('month-total-value').textContent).toEqual('21.17');
  });

  it('displays total row if more than one employee', () => {
    const { queryAllByTestId } = render(
        <MonthlyReport days={someMonth} workLogs={multipleEmployeeWorklog}/>
    );

    expect(queryAllByTestId('table-footer-row')).toHaveLength(1);
  });

  it('emits selected day', () => {
    const onSelect = jest.fn();
    const container = render(
        <MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog} onSelect={onSelect}/>
    );

    fireEvent.click(cell(container, 0));

    expect(onSelect).toHaveBeenCalledWith(['2018/12/01']);
  });

  it('emits selected day when header cell clicked', () => {
    const onSelect = jest.fn();
    const container = render(
        <MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog} onSelect={onSelect}/>
    );

    fireEvent.click(headerCell(container, 0));

    expect(onSelect).toHaveBeenCalledWith(['2018/12/01']);
  });

  it('emits selected days range if click with shift', () => {
    const onSelect = jest.fn();
    const container = render(
        <MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog} selectedDays={['2018/12/01']}
                       onSelect={onSelect}/>
    );

    fireEvent.click(cell(container, 1), {shiftKey: true});

    expect(onSelect).toHaveBeenCalledWith(['2018/12/01', '2018/12/02']);
  });

  it('emits selected days range if click in header cell with shift', () => {
    const onSelect = jest.fn();
    const container = render(
        <MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog} selectedDays={['2018/12/01']}
                       onSelect={onSelect}/>
    );

    fireEvent.click(headerCell(container, 1), {shiftKey: true});

    expect(onSelect).toHaveBeenCalledWith(['2018/12/01', '2018/12/02']);
  });

  it('changes previous selection', () => {
    const onSelect = jest.fn();
    const container = render(
        <MonthlyReport days={someMonth} workLogs={singleEmployeeWorkLog} selectedDays={['2018/12/02', '2018/12/03']}
                       onSelect={onSelect}/>
    );

    fireEvent.click(cell(container, 0));

    expect(onSelect).toHaveBeenCalledWith(['2018/12/01']);
  });

  function headerCells(container: RenderResult) {
    return container.queryAllByTestId('month-day-header');
  }

  function tableRows(container: RenderResult) {
    return container.queryAllByTestId('employee-row');
  }

  function tableRowCells(container: RenderResult, rowIdx = 0) {
    return within(tableRows(container)[rowIdx]).queryAllByTestId('month-day-value');
  }

  function cell(wrapper, cellIdx: number) {
    return tableRowCells(wrapper)[cellIdx];
  }

  function headerCell(wrapper, cellIdx: number) {
    return headerCells(wrapper)[cellIdx];
  }
});
