import React from 'react';
import './CalendarView.scss';
import { Weekdays } from './Weekdays';
import { MonthView } from './MonthView';

interface MonthViewProps {
  month: { year: number; month: number };
}

export const CalendarView = ({month}: MonthViewProps) => {
  return (
      <div className='calendar-view'>
        <Weekdays />
        <MonthView month={month}/>
      </div>
  );
}
