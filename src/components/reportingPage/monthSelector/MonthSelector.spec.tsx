import * as React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';
import { MonthSelector } from './MonthSelector';
import { Chip } from '@material-ui/core';
import { Month } from '../../../utils/Month';

describe('Month Selector', () => {

  beforeEach(() => {
    jest.spyOn(Month, 'current', 'get').mockReturnValue(new Month(2019, 3));
  });

  it('displays 5 months with current on last but one place', () => {
    const wrapper = mount(
        <MonthSelector selectedMonth={{year: 2019, month: 3}} onMonthChange={noop}/>
    );

    expect(monthChips(wrapper)).toHaveLength(5);
    expect(chipsLabels(wrapper)).toEqual(['2018/12', '2019/01', '2019/02', '2019/03', '2019/04']);
  });

  it('allows to display only one month after current', () => {
    const currentMonth = Month.current;
    const nextMonth = currentMonth.next;
    const wrapper = mount(
        <MonthSelector selectedMonth={{year: nextMonth.year, month: nextMonth.month}} onMonthChange={noop}/>
    );

    const months = currentMonth.range(3, 1)
        .map(m => m.toString());
    expect(chipsLabels(wrapper)).toEqual(months);
  });

  it('marks selected month', () => {
    const wrapper = mount(
        <MonthSelector selectedMonth={{year: 2019, month: 3}} onMonthChange={noop}/>
    );

    expect(selectedChipsLabels(wrapper)).toEqual(['2019/03']);
  });

  it('scrolls months list on PREVIOUS click', () => {
    const wrapper = mount(
        <MonthSelector selectedMonth={{year: 2019, month: 3}} onMonthChange={noop}/>
    );

    previousButton(wrapper).simulate('click');

    expect(chipsLabels(wrapper)).toEqual(['2018/11', '2018/12', '2019/01', '2019/02', '2019/03']);
    expect(selectedChipsLabels(wrapper)).toEqual(['2019/03']);
  });

  it('scrolls months list on NEXT click', () => {
    const wrapper = mount(
        <MonthSelector selectedMonth={{year: 2019, month: 2}} onMonthChange={noop}/>
    );
    previousButton(wrapper).simulate('click');
    previousButton(wrapper).simulate('click');

    nextButton(wrapper).simulate('click');

    expect(chipsLabels(wrapper)).toEqual(['2018/11', '2018/12', '2019/01', '2019/02', '2019/03']);
    expect(selectedChipsLabels(wrapper)).toEqual(['2019/02']);
  });

  it('next button is disabled in initial state', () => {
    const wrapper = mount(
        <MonthSelector selectedMonth={{year: 2019, month: 3}} onMonthChange={noop}/>
    );

    expect(nextButton(wrapper).is('[disabled]')).toBeTruthy();
  });

  function monthChips(wrapper) {
    return wrapper.find(Chip);
  }

  function chipsLabels(wrapper) {
    return monthChips(wrapper).map(w => w.text());
  }

  function selectedChips(wrapper) {
    return monthChips(wrapper).filter('[data-chip-selected=true]');
  }

  function selectedChipsLabels(wrapper) {
    return selectedChips(wrapper).map(w => w.text());
  }

  function previousButton(wrapper) {
    return wrapper.find('[data-prev-months-button]').at(0);
  }

  function nextButton(wrapper) {
    return wrapper.find('[data-next-months-button]').at(0);
  }
});
