import React, { Component } from 'react';
import { ReportingWorkLogDTO } from '../../../api/dtos';
import { Chip } from '@material-ui/core';
import { formatWorkload } from '../../../utils/workLogUtils';
import './WorkLogs.scss';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

interface WorkLogsProps {
  workLogs: ReportingWorkLogDTO[];
  onDelete: (workLog: ReportingWorkLogDTO) => void;
}

export class WorkLogs extends Component<WorkLogsProps, {}> {
  render() {
    return (
        <List className='work-logs'>
          {this.props.workLogs.sort(this.workloadDesc).map(workLog => (
              <ListItem key={workLog.id}>
                <Chip data-work-log
                      className='work-log'
                      onDelete={() => this.props.onDelete(workLog)}
                      label={<ChipLabel workLog={workLog}/>}/>
              </ListItem>
          ))}
        </List>
    );
  }

  private workloadDesc = (workLog1, workLog2) => workLog2.workload - workLog1.workload;
}

const ChipLabel = ({workLog}: { workLog: ReportingWorkLogDTO }) => (
    <div className='chip-label'>
      <div className='chip-label__projects' data-chip-label>{workLog.projectNames.join(', ')}</div>
      <div className='chip-label__workload' data-chip-workload>{formatWorkload(workLog.workload)}</div>
    </div>
);