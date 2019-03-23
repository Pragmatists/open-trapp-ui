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
        <div className='day-selector__name' data-day-name>{day.format('dddd') + todayText}</div>
        <div className='day-selector__selector selector'>
          <Fab color="secondary"
               aria-label="Previous"
               data-selector-previous
               onClick={() => onChange(day.subtract(1, 'days').format('YYYY/MM/DD'))}>
            <ArrowBack />
          </Fab>
          <div className='selector__date' data-selector-date>
            {day.format('DD.MM.YYYY')}
          </div>
          <Fab color="secondary"
               aria-label="Next"
               data-selector-next
               onClick={() => onChange(day.add(1, 'days').format('YYYY/MM/DD'))}>
            <ArrowForward />
          </Fab>
        </div>
      </div>
  );
};
