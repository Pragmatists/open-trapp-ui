import React, { Component } from 'react';
import './MonthlyReport.scss';
import { MonthlyReportDay, WorkLog } from "./MonthlyReport.model";
import { Table } from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { chain, entries, reduce, noop, size, values } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import { daysInRange } from '../../utils/dateTimeUtils';
import TableFooter from '@material-ui/core/TableFooter';

interface MonthlyReportProps {
  days: MonthlyReportDay[];
  workLogs: { [employee: string]: WorkLog[] },
  selectedDays?: string[];
  onSelect?: (days: string[]) => void
}

export class MonthlyReport extends Component<MonthlyReportProps, {}> {
  render() {
    const {workLogs} = this.props;
    const workLogEntries = entries(workLogs);
    const singleEmployee = workLogEntries.length === 1;
    return (
        <div className='monthly-report' data-testid='monthly-report'>
          <Table className='monthly-report__report-table report-table'>
            <TableHead>
              {this.renderHeaderCells(singleEmployee)}
            </TableHead>
            <TableBody>
              {workLogEntries.map(entry => this.renderRow(entry[0], entry[1], singleEmployee))}
            </TableBody>
            {
              !singleEmployee && <TableFooter>{this.renderFooter()}</TableFooter>
            }
          </Table>
        </div>
    );
  }

  private renderHeaderCells(singleEmployee: boolean) {
    const {days} = this.props;
    return (
        <TableRow>
          {!singleEmployee && <TableCell className='report-table__cell header-cell report-table__cell--bold'>Employee</TableCell>}
          {days.map((day, idx) => (
              <TableCell key={idx} className={this.cellClass(day, true)} onClick={e => this.onCellClick(e, day.id)} data-testid='month-day-header'>
                <div>{idx + 1}</div>
                <div className='day-name'>{moment(day.id, 'YYYY/MM/DD').format('ddd')}</div>
              </TableCell>
          ))}
          <TableCell className='report-table__cell report-table__cell--bold header-cell'>Total</TableCell>
        </TableRow>
    );
  }

  private renderRow(employee: string, workLogs: WorkLog[], singleEmployee: boolean) {
    const {days} = this.props;
    const workloadForDay = chain(workLogs)
        .groupBy(w => w.day)
        .mapValues(value => reduce(value, (sum, w) => sum + w.workload, 0))
        .mapValues(value => value / 60)
        .value();
    const total = chain(workloadForDay)
        .values()
        .sum()
        .value();
    return (
        <TableRow key={employee} className='report-table__row' data-testid='employee-row'>
          {!singleEmployee && <TableCell className='report-table__cell'>{employee}</TableCell>}
          {days.map((day, idx) => (
              <TableCell key={idx} className={this.cellClass(day)} onClick={e => this.onCellClick(e, day.id)} data-testid='month-day-value'>
                {workloadForDay[day.id]}
              </TableCell>
          ))}
          <TableCell className='report-table__cell report-table__cell--bold' data-testid='month-total-value'>{total}</TableCell>
        </TableRow>
    );
  }

  private renderFooter() {
    const {days, workLogs} = this.props;
    const allWorkLogs = values(workLogs);
    const workloadForDay = chain(allWorkLogs)
        .flatten()
        .groupBy(w => w.day)
        .mapValues(value => reduce(value, (sum, w) => sum + w.workload, 0))
        .mapValues(value => value / 60)
        .value();
    const total = chain(workloadForDay)
        .values()
        .sum()
        .value();
    return (
        <TableRow className='report-table__row' data-testid='table-footer-row'>
          <TableCell className='report-table__cell report-table__cell--bold'>Total</TableCell>
          {days.map((day, idx) => (
              <TableCell key={idx} className={this.cellClass(day)} onClick={e => this.onCellClick(e, day.id)} data-month-day-value>
                {workloadForDay[day.id]}
              </TableCell>
          ))}
          <TableCell className='report-table__cell report-table__cell--bold' data-total-value>{total}</TableCell>
        </TableRow>
    );
  }

  private cellClass(day: MonthlyReportDay, header = false): string {
    const {selectedDays = []} = this.props;
    return classNames('report-table__cell', {
      'header-cell': header,
      'report-table__cell--weekend': day.weekend,
      'report-table__cell--holiday': day.holiday,
      'report-table__cell--selected': selectedDays.includes(day.id)
    });
  }

  private onCellClick(event: React.MouseEvent, day: string) {
    const {onSelect = noop, selectedDays} = this.props;
    event.stopPropagation();
    if (event.shiftKey && size(selectedDays) === 1) {
      onSelect(daysInRange(selectedDays[0], day));
    } else {
      onSelect([day]);
    }
  }
}
