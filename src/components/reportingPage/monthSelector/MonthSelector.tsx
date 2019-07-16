import React from 'react';
import { Fab } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import ArrowForward from '@material-ui/icons/ArrowForwardIos';
import { Month } from '../../../utils/Month';
import './MonthSelector.scss';

interface Props {
  selectedMonth: Month;
  onChange: (month: Month) => void;
}

export const MonthSelector = ({selectedMonth, onChange}: Props) => (
    <div className='reporting-month-selector' data-month-selector>
      <Fab aria-label='Previous'
           data-month-selector-previous
           onClick={() => onChange(selectedMonth.minus(1))}>
        <ArrowBack/>
      </Fab>
      <div className='reporting-month-selector__date' data-month-selector-month>
        {selectedMonth.toString()}
      </div>
      <Fab aria-label='Next'
           data-month-selector-next
           onClick={() => onChange(selectedMonth.plus(1))}>
        <ArrowForward/>
      </Fab>
    </div>
);
