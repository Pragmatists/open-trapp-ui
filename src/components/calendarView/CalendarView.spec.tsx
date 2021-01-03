import React from 'react';
import { fireEvent, render, RenderResult, waitFor, within } from '@testing-library/react';
import { CalendarView } from './CalendarView';

describe('Calendar View', () => {
  it('renders days of week', () => {
    const { getAllByTestId } = render(
        <CalendarView month={{year: 2020, month: 10}} />
    );

    expect(getAllByTestId('weekday').map(e => e.textContent))
        .toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  });

  it('adds offset before first day of month', () => {
    const { getAllByTestId } = render(
        <CalendarView month={{year: 2021, month: 1}} />
    );

    expect(getAllByTestId('offset-day')).toHaveLength(4);
  });

  it('renders days', () => {
    const { getAllByTestId } = render(
        <CalendarView month={{year: 2021, month: 1}} />
    );

    expect(getAllByTestId('month-day')).toHaveLength(31);
  });
});
