import React, { useState } from 'react';
import { uniq, xor } from 'lodash';
import { ReportingWorkLog } from '../../reporting.model';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { SelectorChip } from './SelectorChip';
import './WorkLogSelector.scss';

interface WorkLogSelectorProps {
  title: string;
  workLogs: ReportingWorkLog[];
  chipLabel: (workLog: ReportingWorkLog) => string | string[];
  selected?: string[];
  onSelectionChange: (values: string[]) => void;
  workLogFilter?: (workLog: ReportingWorkLog) => boolean;
  hideIneligible?: boolean;
}

export const WorkLogSelector = ({hideIneligible, selected = [], workLogs, chipLabel, workLogFilter = () => true, onSelectionChange, title}: WorkLogSelectorProps) => {
  const [ineligibleHidden, setIneligibleHidden] = useState(hideIneligible);

  const renderChip = (label: string, idx: number) => {
    const workload = workLogs
        .filter(w => chipLabel(w) === label || chipLabel(w).includes(label))
        .filter(workLogFilter)
        .map(w => w.workload)
        .reduce((prev, curr) => prev + curr, 0);
    return (
        <SelectorChip key={idx}
                      label={label}
                      workload={workload}
                      selected={selected.includes(label)}
                      onClick={() => onSelectionChange(xor(selected, [label]))}/>
    );
  };

  const labels = uniq(
      workLogs
          .filter(w => !ineligibleHidden || workLogFilter(w))
          .map(chipLabel)
          .map(v => Array.isArray(v) ? v : [v])
          .reduce(((prev, curr) => [...prev, ...curr]), [])
  ).sort();

  const onIneligibleButtonClick = () => setIneligibleHidden(!ineligibleHidden);
  return (
      <div className='work-log-selector'>
        <div className='work-log-selector__header'>{title}</div>
        <div className='work-log-selector__chips'>
          {
            labels.map(renderChip)
          }
        </div>
        <div className='work-log-selector__footer'>
          <Button size='small' onClick={onIneligibleButtonClick}>
            {hideIneligible ? <VisibilityIcon/> : <VisibilityOffIcon/>}
            {hideIneligible ? 'Show ineligible' : 'Hide ineligible'}
          </Button>
          <Button size='small' onClick={() => onSelectionChange([])}>
            <ClearIcon/>
            None
          </Button>
          <Button size='small' onClick={() => onSelectionChange(labels)}>
            <AddIcon/>
            All
          </Button>
        </div>
      </div>
  );
}
