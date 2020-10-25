import React from 'react';
import moment from 'moment';
import { fireEvent, render } from '@testing-library/react';
import { noop } from 'lodash';
import { DaySelector } from './DaySelector';

describe('Day Selector', () => {
  it('displays weekday name', () => {
    const { getByText } = render(
        <DaySelector selectedDay={'2019/03/10'} onChange={noop}/>
    );

    expect(getByText('Sunday')).toBeInTheDocument();
  });

  it('adds "today" to weekday', () => {
    const today = moment();
    const { getByText } = render(
        <DaySelector selectedDay={today.format('YYYY/MM/DD')} onChange={noop}/>
    );

    expect(getByText(`${today.format('dddd')} (today)`)).toBeInTheDocument();
  });

  it('displays selected date', () => {
    const { getByText } = render(
        <DaySelector selectedDay={'2019/03/10'} onChange={noop}/>
    );

    expect(getByText('10.03.2019')).toBeInTheDocument();
  });

  it('emits change on PREVIOUS button click', () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
        <DaySelector selectedDay={'2019/03/10'} onChange={onChange}/>
    );

    fireEvent.click(getByLabelText('Previous'));

    expect(onChange).toHaveBeenCalledWith('2019/03/09');
  });

  it('emits change on NEXT button click', () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
        <DaySelector selectedDay={'2019/03/10'} onChange={onChange}/>
    );

    fireEvent.click(getByLabelText('Next'));

    expect(onChange).toHaveBeenCalledWith('2019/03/11');
  });
});
