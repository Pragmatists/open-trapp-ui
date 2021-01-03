import './MonthlyReport.scss';
import { MonthlyReportDay, WorkLog } from "./MonthlyReport.model";
import { Table } from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { chain, entries, noop, reduce, size, values } from 'lodash';
import classNames from 'classnames';
import { daysInRange } from '../../utils/dateTimeUtils';
import TableFooter from '@material-ui/core/TableFooter';
import { ReportHeaderCell, ReportWorkloadCell } from './ReportCell';
import { workloadAsDays } from '../../utils/workloadUtils';

interface ReportDay extends MonthlyReportDay {
  selected: boolean;
}

const Footer = ({days, workLogs}: { days: MonthlyReportDay[]; workLogs: { [employee: string]: WorkLog[] } }) => {
  const workloadForDay = chain(values(workLogs))
      .flatten()
      .groupBy(w => w.day)
      .mapValues(value => reduce(value, (sum, w) => sum + w.workload, 0))
      .value();
  const total = chain(workloadForDay)
      .values()
      .sum()
      .value();

  const cellClass = (day: MonthlyReportDay) => classNames('report-table__cell', {
    'report-table__cell--weekend': day.weekend,
    'report-table__cell--holiday': day.holiday
  });

  return (
      <TableFooter>
        <TableRow className='report-table__row' data-testid='table-footer-row'>
          <TableCell className='report-table__cell report-table__cell--bold'>Total</TableCell>
          {days.map((day, idx) => (
              <TableCell key={idx} className={cellClass(day)}>
                {workloadAsDays(workloadForDay[day.id])}
              </TableCell>
          ))}
          <TableCell className='report-table__cell report-table__cell--bold' data-total-value>{workloadAsDays(total)}</TableCell>
        </TableRow>
      </TableFooter>
  );
}

interface EmployeeRowProps {
  employee: string;
  workLogs: WorkLog[];
  singleEmployee: boolean;
  days: ReportDay[];
  onCellClick: (day: MonthlyReportDay, range: boolean) => void;
}

const EmployeeRow = ({employee, workLogs, singleEmployee, days, onCellClick}: EmployeeRowProps) => {
  const workloadForDay = chain(workLogs)
      .groupBy(w => w.day)
      .mapValues(value => reduce(value, (sum, w) => sum + w.workload, 0))
      .value();
  const total = chain(workloadForDay)
      .values()
      .sum()
      .value();
  return (
      <TableRow key={employee} className='report-table__row' data-testid='employee-row'>
        {!singleEmployee && <TableCell className='report-table__cell'>{employee}</TableCell>}
        {days.map((day, idx) => (
            <ReportWorkloadCell key={idx}
                                day={day}
                                workload={workloadForDay[day.id]}
                                selected={day.selected}
                                onClick={onCellClick}
                                data-testid='month-day-value'/>
        ))}
        <TableCell className='report-table__cell report-table__cell--bold' data-testid='month-total-value'>
          {workloadAsDays(total)}
        </TableCell>
      </TableRow>
  );
}

interface MonthlyReportProps {
  days: MonthlyReportDay[];
  workLogs: { [employee: string]: WorkLog[] },
  selectedDays?: string[];
  onSelect?: (days: string[]) => void
}

export const MonthlyReport = ({workLogs, days = [], selectedDays = [], onSelect = noop}: MonthlyReportProps) => {
  const workLogEntries = entries(workLogs);
  const singleEmployee = workLogEntries.length === 1;
  const daysWithSelection = days.map(d => ({...d, selected: selectedDays.includes(d.id)}));

  const onCellClick = (day: MonthlyReportDay, range: boolean) => {
    if (range && size(selectedDays) === 1) {
      onSelect(daysInRange(selectedDays[0], day.id));
    } else {
      onSelect([day.id]);
    }
  }

  return (
      <div className='monthly-report' data-testid='monthly-report'>
        <Table className='monthly-report__report-table report-table'>
          <TableHead>
            <TableRow className='report-table__header-row'>
              {!singleEmployee && <TableCell className='report-table__cell report-table__cell--bold'>Employee</TableCell>}
              {daysWithSelection.map((day, idx) => (
                  <ReportHeaderCell key={idx}
                                    day={day}
                                    selected={day.selected}
                                    onClick={onCellClick}
                                    data-testid='month-day-header'/>
              ))}
              <TableCell className='report-table__cell report-table__cell--bold header-cell'>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workLogEntries.map(entry => (
                <EmployeeRow key={entry[0]}
                             employee={entry[0]}
                             workLogs={entry[1]}
                             singleEmployee={singleEmployee}
                             days={daysWithSelection}
                             onCellClick={onCellClick}/>
            ))}
          </TableBody>
          {
            !singleEmployee && <Footer days={daysWithSelection} workLogs={workLogs}/>
          }
        </Table>
      </div>
  );
}
