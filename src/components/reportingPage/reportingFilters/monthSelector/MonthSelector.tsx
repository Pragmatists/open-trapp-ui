import { useState } from 'react';
import { Button } from '@material-ui/core';
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import './MonthSelector.scss';
import { Month } from '../../../../utils/Month';
import Chip from '@material-ui/core/Chip';

const MonthChip = ({month, isSelected, onClick}: { month: Month, isSelected: boolean, onClick: VoidFunction }) => (
    <Chip label={month.toString()}
          color='primary'
          variant={isSelected ? 'default' : 'outlined'}
          className='chip'
          onClick={onClick}
          data-testid='month-chip'
          data-chip-selected={isSelected}/>
);

interface MonthSelectorProps {
  selectedMonth: { year: number, month: number };
  onMonthChange: (year: number, month: number) => void;
}

export const MonthSelector = ({selectedMonth, onMonthChange}: MonthSelectorProps) => {
  const [shift, setShift] = useState(0);
  const months = Month.current.range(3, 1)
      .map(m => shift > 0 ? m.plus(shift) : m.minus(-shift));

  return (
      <div className='month-selector' data-testid='months-selector'>
        <div className='month-selector__header'>Month</div>
        <div className='month-selector__months'>
          <Button onClick={() => setShift(shift - 1)} data-testid='prev-months-button'>
            <ArrowUpIcon/>
          </Button>
          {
            months.map((month: Month, idx: number) =>
                <MonthChip key={idx}
                           month={month}
                           isSelected={new Month(selectedMonth.year, selectedMonth.month).toString() === month.toString()}
                           onClick={() => onMonthChange(month.year, month.month)}/>
            )
          }
          <Button onClick={() => setShift(shift + 1)} data-testid='next-months-button'>
            <ArrowDownIcon/>
          </Button>
        </div>
      </div>
  );
}
