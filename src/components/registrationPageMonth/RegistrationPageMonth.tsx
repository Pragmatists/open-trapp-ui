import React from 'react';
import { MonthlyReport } from '../monthlyReport/MonthlyReport';
import Button from '@material-ui/core/Button';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Paper from '@material-ui/core/Paper';
import { DayDTO } from '../../api/dtos';
import { WorkLog } from '../monthlyReport/MonthlyReport.model';
import { Divider } from '@material-ui/core';
import { Month } from '../../utils/Month';
import './RegistrationPageMonth.scss';

interface Props {
  selectedMonth: Month,
  days: DayDTO[];
  workLogs: { [employee: string]: WorkLog[] }
  onChange: (month: Month) => void;
  onDaysSelected?: (days: string[]) => void;
  selectedDays?: string[];
}

export const RegistrationPageMonth = ({days, workLogs, selectedMonth, selectedDays, onDaysSelected, onChange}: Props) => (
    <div className='registration-page-month'>
      <div className='registration-page-month__header' data-selected-month-header>
        <span>{selectedMonth.toString()}</span> month worklog
      </div>
      <Divider variant='fullWidth'/>
      <div className='registration-page-month__description'>
        <span>Click</span> on date to set it on worklog expression
      </div>
      <div className='registration-page-month__description'>
        <span>Shift + Click</span> on date to set dates range on worklog expression
      </div>
      <Paper>
        <MonthlyReport days={days}
                       workLogs={workLogs}
                       selectedDays={selectedDays}
                       onSelect={onDaysSelected}/>
      </Paper>
      <div className='registration-page-month__navigate-section'>
        <Button variant='contained'
                color='primary'
                onClick={() => onChange(selectedMonth.previous)}
                data-prev-month-button>
          <NavigateBeforeIcon/>
          Previous
        </Button>
        <Button variant='contained'
                color='primary'
                onClick={() => onChange(selectedMonth.next)}
                data-next-month-button>
          Next
          <NavigateNextIcon/>
        </Button>
      </div>
    </div>
);
