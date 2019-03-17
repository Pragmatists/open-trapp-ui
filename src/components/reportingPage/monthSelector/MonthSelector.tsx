import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import './MonthSelector.scss';
import { Month } from '../../../utils/dateTimeUtils';
import Chip from '@material-ui/core/Chip';

interface MonthSelectorProps {
  selectedMonth: { year: number, month: number };
  onMonthChange: (year: number, month: number) => void;
}

interface MonthSelectorState {
  shift: number;
}

export class MonthSelector extends Component<MonthSelectorProps, MonthSelectorState> {
  state = {
    shift: 0
  };

  render(): React.ReactNode {
    const months = this.months;
    return (
        <div className='month-selector'>
          <div className='month-selector__header'>Month</div>
          <div className='month-selector__months'>
            <Button onClick={this.onPreviousClick} data-prev-months-button>
              <ArrowUpIcon/>
            </Button>
            {
              months.map(this.renderChip)
            }
            <Button onClick={this.onNextClick} disabled={this.state.shift === 0} data-next-months-button>
              <ArrowDownIcon/>
            </Button>
          </div>
        </div>
    );
  }

  private renderChip = (month: Month, idx: number) => {
    const {selectedMonth, onMonthChange} = this.props;
    const isSelected = new Month(selectedMonth.year, selectedMonth.month).toString() === month.toString();
    return (
        <Chip key={idx}
              label={month.toString()}
              color='secondary'
              variant={isSelected ? 'default' : 'outlined'}
              className='chip'
              onClick={() => onMonthChange(month.year, month.month)}
              data-chip-month
              data-chip-selected={isSelected}/>
    );
  };

  private get months(): Month[] {
    const {year, month} = this.props.selectedMonth;
    const currentMonth = new Month(year, month);
    const shift = this.state.shift;
    return currentMonth.range(3, 1)
        .map(m => shift > 0 ? m.plus(shift) : m.minus(-shift));
  }

  private onPreviousClick = () => this.setState({
    shift: this.state.shift - 1
  });

  private onNextClick = () => this.setState({
    shift: this.state.shift + 1
  });
}
