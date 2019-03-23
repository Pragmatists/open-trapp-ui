import React from 'react';
import moment from 'moment';
import { ReactWrapper, shallow } from 'enzyme';
import { noop } from 'lodash';
import { DaySelector } from './DaySelector';

describe('Day Selector', () => {
  it('displays weekday name', () => {
    const wrapper = shallow(
        <DaySelector selectedDay={'2019/03/10'} onChange={noop}/>
    );

    expect(weekdayName(wrapper)).toEqual('Sunday');
  });

  it('adds "today" to weekday', () => {
    const today = moment();
    const wrapper = shallow(
        <DaySelector selectedDay={today.format('YYYY/MM/DD')} onChange={noop}/>
    );

    expect(weekdayName(wrapper)).toEqual(`${today.format('dddd')} (today)`);
  });

  it('displays selected date', () => {
    const wrapper = shallow(
        <DaySelector selectedDay={'2019/03/10'} onChange={noop}/>
    );

    expect(selectorDate(wrapper)).toEqual('10.03.2019');
  });

  it('emits change on PREVIOUS button click', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
        <DaySelector selectedDay={'2019/03/10'} onChange={onChange}/>
    );

    selectorPreviousButton(wrapper).simulate('click');

    expect(onChange).toHaveBeenCalledWith('2019/03/09');
  });

  it('emits change on NEXT button click', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
        <DaySelector selectedDay={'2019/03/10'} onChange={onChange}/>
    );

    selectorNextButton(wrapper).simulate('click');

    expect(onChange).toHaveBeenCalledWith('2019/03/11');
  });

  function weekdayName(wrapper): string {
    return wrapper.find('[data-day-name]').text();
  }

  function selectorDate(wrapper): string {
    return wrapper.find('[data-selector-date]').text();
  }

  function selectorNextButton(wrapper): ReactWrapper {
    return wrapper.find('[data-selector-next]').at(0);
  }

  function selectorPreviousButton(wrapper): ReactWrapper {
    return wrapper.find('[data-selector-previous]').at(0);
  }
});
