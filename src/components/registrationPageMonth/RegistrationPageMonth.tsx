import React, { Component } from 'react';
import { MonthlyReport } from '../monthlyReport/MonthlyReport';
import Button from '@material-ui/core/Button';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import { DayDTO } from '../../api/dtos';
import { WorkLog } from '../monthlyReport/MonthlyReport.model';
import { Divider } from '@material-ui/core';
import './RegistrationPageMonth.scss'

interface RegistrationPageMonthProps {
  selectedMonth: { year: number, month: number },
  days: DayDTO[];
  workLogs: { [employee: string]: WorkLog[] }
  onChange: (year: number, month: number) => void;
  onDaysSelected?: (days: string[]) => void;
  selectedDays?: string[];
}

export class RegistrationPageMonth extends Component<RegistrationPageMonthProps, {}> {
  render() {
    const {days, workLogs, selectedMonth, selectedDays, onDaysSelected} = this.props;
    return (
        <div className='registration-page-month'>
          <div className='registration-page-month__header' data-selected-month-header>
            <span>{moment([selectedMonth.year, selectedMonth.month - 1, 1]).format('YYYY/MM')}</span> month worklog
          </div>
          <Divider variant='fullWidth'/>
          <div className='registration-page-month__description'>
            <span>Click</span> on date to set it on worklog expression
          </div>
          <div className='registration-page-month__description'>
            <span>Shift + Click</span> on date to set dates range on worklog expression
          </div>
          <Paper>
            <MonthlyReport days={days} workLogs={workLogs} selectedDays={selectedDays} onSelect={onDaysSelected}/>
          </Paper>
          <div className='registration-page-month__navigate-section'>
            <Button variant="contained" color="secondary" onClick={this.onPrevious} data-prev-month-button>
              <NavigateBeforeIcon/>
              Previous
            </Button>
            <Button variant="contained" color="secondary" onClick={this.onNext} data-next-month-button>
              Next
              <NavigateNextIcon/>
            </Button>
          </div>
        </div>
    );
  }

  private onNext = () => {
    const {selectedMonth, onChange} = this.props;
    const {year, month} = selectedMonth;
    if (month === 12) {
      onChange(year + 1, 1);
    } else {
      onChange(year, month + 1);
    }
  };

  private onPrevious = () => {
    const {selectedMonth, onChange} = this.props;
    const {year, month} = selectedMonth;
    if (month === 1) {
      onChange(year - 1, 12);
    } else {
      onChange(year, month - 1);
    }
  };
}
