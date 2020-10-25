import React from 'react';
import moment from 'moment';
import { Fab } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import ArrowForward from '@material-ui/icons/ArrowForwardIos';
import './DaySelector.scss';

interface DaySelectorProps {
  selectedDay: string;
  onChange: (newSelection: string) => void;
}

export const DaySelector = ({selectedDay, onChange}: DaySelectorProps) => {
  const day = moment(selectedDay, 'YYYY/MM/DD');
  const today = day.isSame(moment(), 'day');
  const todayText = today ? ' (today)' : '';
  return (
      <div className='day-selector'>
        <div className='day-selector__name'>{day.format('dddd') + todayText}</div>
        <div className='day-selector__selector selector'>
          <Fab aria-label='Previous'
               onClick={() => onChange(day.subtract(1, 'days').format('YYYY/MM/DD'))}
               data-testid='day-selector-previous'>
            <ArrowBack />
          </Fab>
          <div className='selector__date'>
            {day.format('DD.MM.YYYY')}
          </div>
          <Fab aria-label='Next'
               onClick={() => onChange(day.add(1, 'days').format('YYYY/MM/DD'))}
               data-testid='day-selector-next'>
            <ArrowForward />
          </Fab>
        </div>
      </div>
  );
};
