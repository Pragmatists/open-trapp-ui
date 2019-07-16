import React from 'react';
import { ReportingWorkLogDTO } from '../../../api/dtos';
import './WorkLogs.scss';
import List from '@material-ui/core/List';
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from '@material-ui/core/ListItem';
import { WorkLogChip } from '../../workLogChip/WorkLogChip';

interface Props {
  workLogs: ReportingWorkLogDTO[];
  onDelete: (workLogId: string) => void;
}

export const WorkLogs = ({workLogs, onDelete}: Props) => {
  const workloadDesc = (workLog1, workLog2) => workLog2.workload - workLog1.workload;
  return (
      <List className='work-logs'>
        <ListSubheader className='work-logs__title'>Reported time</ListSubheader>
        {workLogs.sort(workloadDesc)
            .map(workLog => (
                <ListItem key={workLog.id}>
                  <WorkLogChip onDelete={onDelete} workLog={workLog} size='big'/>
                </ListItem>
            ))
        }
      </List>
  );
};
