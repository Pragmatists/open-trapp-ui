import React from 'react';
import { formatWorkload } from '../../utils/workLogUtils';
import { Chip } from '@material-ui/core';
import './WorkLogChip.scss';

interface WorkLog {
  id?: string;
  workload: number
  projectNames: string[];
}

interface Props {
  onDelete?: (workLogId: string) => void;
  workLog: WorkLog;
  size?: 'small' | 'big';
}

export const WorkLogChip = ({onDelete, workLog, size}: Props) => (
    <Chip data-testid='work-log'
          className={size === 'big' ? 'work-log work-log--big' : 'work-log'}
          onDelete={onDelete ? () => onDelete(workLog.id) : undefined}
          label={<ChipLabel projectNames={workLog.projectNames} workload={workLog.workload} />} />
);

interface LabelProps {
  projectNames: string[];
  workload: number;
}

const ChipLabel = ({projectNames, workload}: LabelProps) => (
    <div className='chip-label'>
      <div className='chip-label__projects' data-testid='chip-label'>{projectNames.join(', ')}</div>
      <div className='chip-label__workload' data-testid='chip-workload'>{formatWorkload(workload)}</div>
    </div>
);
