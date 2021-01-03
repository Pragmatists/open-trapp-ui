import React from 'react';
import './Weekdays.scss';

export const Weekdays = ({}) => {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return (
      <div className='weekdays'>
        {
          weekdays.map(d => (
              <div key={d} data-testid='weekday'>{d}</div>
          ))
        }
      </div>
  );
}
