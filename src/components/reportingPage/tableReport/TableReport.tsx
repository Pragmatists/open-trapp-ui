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
    const {workLogs} = this.props;
    const workLogsByDay = groupBy(workLogs, w => w.day);
    const days = keys(workLogsByDay);
    return (
        <div className='table-report'>
          <EditWorkLogDialog workLog={this.state.editedWorkLog} onClose={this.onEditFinished} open={this.state.editedWorkLog !== undefined} />
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
        <TableRow key={`${day}-${employee}-${idx}`}>
          {employeeIdx + idx === 0 && <TableCell rowSpan={numberOfEntries} data-day-cell>{day}</TableCell>}
          {idx === 0 && <TableCell rowSpan={size(workLogs)} data-employee-cell>{employee}</TableCell>}
          <TableCell data-workload-cell>{formatWorkload(workLog.workload)}</TableCell>
          <TableCell data-tags-cell>{workLog.projectNames.join(', ')}</TableCell>
          <TableCell padding='checkbox'>
            {username === workLog.employee && <Button onClick={() => this.onEditWorkLog(workLog)} data-edit-button>
              <EditIcon/>
            </Button>}
          </TableCell>
          <TableCell padding='checkbox'>
            {username === workLog.employee && <Button onClick={() => onRemoveWorkLog(workLog.id)} data-remove-button>
              <DeleteIcon/>
            </Button>}
          </TableCell>
        </TableRow>
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