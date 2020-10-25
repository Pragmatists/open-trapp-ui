import React, { Component } from 'react';
import { EditedWorkLog, ReportingWorkLog } from '../reporting.model';
import { Table } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { chain, groupBy, keys, size } from 'lodash';
import { formatWorkload } from '../../../utils/workLogUtils';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import './TableReport.scss';
import Button from '@material-ui/core/Button';
import { EditWorkLogDialog } from '../editWorkLogDialog/EditWorkLogDialog';

interface TableReportProps {
  workLogs: ReportingWorkLog[];
  tags: string[]
  onRemoveWorkLog: (id: string) => void;
  onEditWorkLog: (workLog: EditedWorkLog) => void;
  username: string;
}

interface TableReportState {
  editedWorkLog?: ReportingWorkLog;
}

export class TableReport extends Component<TableReportProps, TableReportState> {
  state = {
    editedWorkLog: undefined
  };

  render() {
    const {workLogs, tags} = this.props;
    const workLogsByDay = groupBy(workLogs, w => w.day);
    const days = keys(workLogsByDay);
    return (
        <div className='table-report' data-testid='table-report'>
          <EditWorkLogDialog workLog={this.state.editedWorkLog}
                             tags={tags}
                             onClose={this.onEditFinished}
                             open={this.state.editedWorkLog !== undefined}/>
          <Table className='table-report__table table'>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Workload</TableCell>
                <TableCell>Project</TableCell>
                <TableCell padding='checkbox'/>
                <TableCell padding='checkbox'/>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                chain(days)
                    .reverse()
                    .map(day => this.renderDay(day, workLogsByDay[day]))
                    .flatten()
                    .value()
              }
            </TableBody>
          </Table>
        </div>
    );
  }

  private renderDay(day: string, workLogs: ReportingWorkLog[]) {
    const workLogsByEmployee = groupBy(workLogs, w => w.employee);
    const employees = keys(workLogsByEmployee);
    const numberOfEntries = size(workLogs);
    return chain(employees)
        .map((employee, idx) => this.renderEmployee(day, employee, workLogsByEmployee[employee], idx, numberOfEntries))
        .flatten()
        .value();
  }

  private renderEmployee(day: string, employee: string, workLogs: ReportingWorkLog[], employeeIdx: number, numberOfEntries: number) {
    const {onRemoveWorkLog, username} = this.props;
    return workLogs.map((workLog, idx) => (
        <TableReportRow key={`${day}-${employee}-${idx}`}
                        day={employeeIdx + idx === 0 ? {text: day, rowSpan: numberOfEntries} : undefined}
                        employee={idx === 0 ? {text: employee, rowSpan: size(workLogs)} : undefined}
                        username={username}
                        workLog={workLog}
                        onEdit={() => this.onEditWorkLog(workLog)}
                        onRemove={() => onRemoveWorkLog(workLog.id)}/>
    ));
  }

  private onEditWorkLog(workLog: ReportingWorkLog) {
    this.setState({
      editedWorkLog: workLog
    });
  };

  private onEditFinished = (workLog?: EditedWorkLog) => {
    const {onEditWorkLog} = this.props;
    this.setState({
      editedWorkLog: undefined
    });
    if (workLog) {
      onEditWorkLog(workLog);
    }
  }
}

interface TableReportRowProps {
  workLog: ReportingWorkLog;
  username: string;
  onEdit: VoidFunction;
  onRemove: VoidFunction;
  employee?: {text: string, rowSpan: number};
  day?: {text: string, rowSpan: number};
}

const TableReportRow = ({day, employee, workLog, username, onEdit, onRemove}: TableReportRowProps) => (
    <TableRow data-testid='table-report-row'>
      {day && <TableCell rowSpan={day.rowSpan} data-testid='day-cell'>{day.text}</TableCell>}
      {employee && <TableCell rowSpan={employee.rowSpan} data-testid='employee-cell'>{employee.text}</TableCell>}
      <TableCell data-testid='workload-cell'>{formatWorkload(workLog.workload)}</TableCell>
      <TableCell data-testid='tags-cell'>{workLog.projectNames.join(', ')}</TableCell>
      <TableCell padding='checkbox'>
        {username === workLog.employee && <Button onClick={onEdit} data-testid='edit-button'>
          <EditIcon/>
        </Button>}
      </TableCell>
      <TableCell padding='checkbox'>
        {username === workLog.employee && <Button onClick={onRemove} data-testid='remove-button'>
          <DeleteIcon/>
        </Button>}
      </TableCell>
    </TableRow>
);
