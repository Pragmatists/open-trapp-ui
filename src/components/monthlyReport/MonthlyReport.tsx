import React, { Component } from 'react';
import './MonthlyReport.scss';
import { MonthlyReportDay, WorkLog } from "./MonthlyReport.model";
import { Table } from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { chain, entries, reduce } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';

interface MonthlyReportProps {
  days: MonthlyReportDay[];
  workLogs: { [employee: string]: WorkLog[] }
}

export class MonthlyReport extends Component<MonthlyReportProps, {}> {
  render() {
    const {workLogs} = this.props;
    const workLogEntries = entries(workLogs);
    const singleEmployee = workLogEntries.length === 1;
    return (
        <div className='monthly-report'>
          <Table className='monthly-report__report-table report-table'>
            <TableHead>
              {this.renderHeaderCells(singleEmployee)}
            </TableHead>
            <TableBody>
              {workLogEntries.map(entry => this.renderRow(entry[0], entry[1], singleEmployee))}
            </TableBody>
          </Table>
        </div>
    );
  }

  private renderHeaderCells(singleEmployee: boolean) {
    const {days} = this.props;
    return (
        <TableRow>
          {!singleEmployee && <TableCell className='report-table__cell header-cell'>Employee</TableCell>}
          {days.map((day, idx) => (
              <TableCell key={idx} className={this.cellClass(day, true)} data-month-day-header>
                <div>{idx + 1}</div>
                <div className='day-name'>{moment(day.id, 'YYYY/MM/DD').format('ddd')}</div>
              </TableCell>
          ))}
          <TableCell className='report-table__cell report-table__cell--total header-cell' data-total-header>Total</TableCell>
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
        <TableRow key={employee} className='report-table__row'>
          {!singleEmployee && <TableCell className='report-table__cell'>{employee}</TableCell>}
          {days.map((day, idx) => (
              <TableCell key={idx} className={this.cellClass(day)} data-month-day-value>
                {workloadForDay[day.id]}
              </TableCell>
          ))}
          <TableCell className='report-table__cell report-table__cell--total' data-total-value>{total}</TableCell>
        </TableRow>
    );
  }

  private cellClass(day: MonthlyReportDay, header = false): string {
    return classNames('report-table__cell', {
      'header-cell': header,
      'report-table__cell--weekend': day.weekend,
      'report-table__cell--holiday': day.holiday
    });
  }
}
