import React, { FunctionComponent } from 'react';
import moment from 'moment';
import { range } from 'lodash';
import './MonthView.scss';

interface DayProps {
  year: number;
  month: number;
  day: number;
}

const Day: FunctionComponent<DayProps> = ({day, children}) => {
  return (
      <div className='day-wrapper'>
        <div className='day' data-testid='month-day'>
          <div className='day__title'>{day}</div>
          <div className='day__content'>{children}</div>
        </div>
      </div>
  )
}

const Offset = ({offset}: {offset: number}) => (
    <>
      {
        range(0, offset).map(idx => (
            <div key={idx} data-testid='offset-day' />
        ))
      }
    </>
);

export const MonthView = ({month}: {month: {year: number, month: number}}) => {
  const activeStartDate = moment([month.year, month.month - 1, 1]);
  const dayOfWeek = activeStartDate.isoWeekday() - 1;
  const end = activeStartDate.endOf('month').date();

  return (
      <div className='month-view'>
        <Offset offset={dayOfWeek} />
        {
          range(1, end + 1).map(day => (
              <Day key={day} year={month.year} month={month.month} day={day} ></Day>
          ))
        }
      </div>
  );
}
