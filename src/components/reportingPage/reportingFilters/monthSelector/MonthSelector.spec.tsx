import * as React from 'react';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { noop } from 'lodash';
import { MonthSelector } from './MonthSelector';
import { Month } from '../../../../utils/Month';

describe('Month Selector', () => {

  beforeEach(() => {
    jest.spyOn(Month, 'current', 'get').mockReturnValue(new Month(2019, 3));
  });

  it('displays 5 months with current on last but one place', () => {
    const container = render(
        <MonthSelector selectedMonth={{year: 2019, month: 3}} onMonthChange={noop}/>
    );

    expect(monthChips(container)).toHaveLength(5);
    expect(chipsLabels(container)).toEqual(['2018/12', '2019/01', '2019/02', '2019/03', '2019/04']);
  });

  it('allows to display only one month after current', () => {
    const currentMonth = Month.current;
    const nextMonth = currentMonth.next;
    const container = render(
        <MonthSelector selectedMonth={{year: nextMonth.year, month: nextMonth.month}} onMonthChange={noop}/>
    );

    const months = currentMonth.range(3, 1)
        .map(m => m.toString());
    expect(chipsLabels(container)).toEqual(months);
  });

  it('marks selected month', () => {
    const { getByText } = render(
        <MonthSelector selectedMonth={{year: 2019, month: 3}} onMonthChange={noop}/>
    );

    expect(getByText('2019/03').parentNode).toHaveAttribute('data-chip-selected', "true");
  });

  it('scrolls months list on PREVIOUS click', () => {
    const container = render(
        <MonthSelector selectedMonth={{year: 2019, month: 3}} onMonthChange={noop}/>
    );

    fireEvent.click(container.getByTestId('prev-months-button'));

    expect(chipsLabels(container)).toEqual(['2018/11', '2018/12', '2019/01', '2019/02', '2019/03']);
    expect(container.getByText('2019/03').parentNode).toHaveAttribute('data-chip-selected', "true");
  });

  it('scrolls months list on PREVIOUS and NEXT click', () => {
    const container = render(
        <MonthSelector selectedMonth={{year: 2019, month: 2}} onMonthChange={noop}/>
    );
    fireEvent.click(container.getByTestId('prev-months-button'));
    fireEvent.click(container.getByTestId('prev-months-button'));

    fireEvent.click(container.getByTestId('next-months-button'));

    expect(chipsLabels(container)).toEqual(['2018/11', '2018/12', '2019/01', '2019/02', '2019/03']);
    expect(container.getByText('2019/02').parentNode).toHaveAttribute('data-chip-selected', "true");
  });

  it('scrolls months list on NEXT click', () => {
    const container = render(
        <MonthSelector selectedMonth={{year: 2019, month: 2}} onMonthChange={noop}/>
    );

    fireEvent.click(container.getByTestId('next-months-button'));

    expect(chipsLabels(container)).toEqual(['2019/01', '2019/02', '2019/03', '2019/04', '2019/05']);
    expect(container.getByText('2019/02').parentNode).toHaveAttribute('data-chip-selected', "true");
  });

  function monthChips(container: RenderResult) {
    return container.queryAllByTestId('month-chip');
  }

  function chipsLabels(container: RenderResult) {
    return monthChips(container).map(w => w.textContent);
  }
});
