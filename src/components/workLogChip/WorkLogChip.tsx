import React from 'react';
import { formatWorkload } from '../../utils/workLogUtils';
import { Chip } from '@material-ui/core';
import './WorkLogChip.scss';

interface WorkLog {
  id: string;
  workload: number
  projectNames: string[];
}

interface Props {
  onDelete: (workLogId: string) => void;
  workLog: WorkLog;
}

export const WorkLogChip = ({onDelete, workLog}: Props) => (
    <Chip data-work-log
          className='work-log'
          onDelete={() => onDelete(workLog.id)}
          label={<ChipLabel projectNames={workLog.projectNames} workload={workLog.workload} />} />
);

interface LabelProps {
  projectNames: string[];
  workload: number;
}

const ChipLabel = ({projectNames, workload}: LabelProps) => (
    <div className='chip-label'>
      <div className='chip-label__projects' data-chip-label>{projectNames.join(', ')}</div>
      <div className='chip-label__workload' data-chip-workload>{formatWorkload(workload)}</div>
    </div>
);
