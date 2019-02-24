import React, { Component } from 'react';
import './MonthlyReport.scss';
import { MonthlyReportDay, WorkLog } from "./MonthlyReport.model";
import { Table } from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { entries } from 'lodash';
import moment from 'moment';

interface MonthlyReportProps {
  days: MonthlyReportDay[];
  workLogs: { [employee: string]: WorkLog[] }
}

export class MonthlyReport extends Component<MonthlyReportProps, {}> {
  render() {
    const {workLogs: workLogs} = this.props;
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
              <TableCell key={idx} className='report-table__cell header-cell' data-month-day-header>
                <div>{idx + 1}</div>
                <div className='day-name'>{moment(day.id, 'YYYY/MM/DD').format('ddd')}</div>
              </TableCell>
          ))}
          <TableCell align="right" className='report-table__cell header-cell' data-total-header>Total</TableCell>
        </TableRow>
    );
  }

  private renderRow(employee: string, workLogs: WorkLog[], singleEmployee: boolean) {
    return (
        <TableRow key={employee}>
          {!singleEmployee && <TableCell className='report-table__cell'>{employee}</TableCell>}
          {workLogs.map((workLog, idx) => (
              <TableCell key={idx} align='center' className='report-table__cell' data-month-day-value>
                {workLog.workload}
              </TableCell>
          ))}
          <TableCell align='center' className='report-table__cell' data-total-value>12</TableCell>
        </TableRow>
    );
  }
}
