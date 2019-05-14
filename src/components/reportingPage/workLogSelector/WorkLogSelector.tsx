import React, { Component } from 'react';
import { Chip } from '@material-ui/core';
import { xor, uniq } from 'lodash';
import { ReportingWorkLog } from '../reporting.model';
import { formatWorkload } from '../../../utils/workLogUtils';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import './WorkLogSelector.scss';

interface ChipLabelProps {
  label: string;
  workload: number;
}

const ChipLabel = ({label, workload}: ChipLabelProps) => (
    <div className='chip-content'>
      <div className='chip-content__label' data-chip-label>{label}</div>
      {workload > 0 ? <div className='chip-content__workload' data-chip-workload>{formatWorkload(workload)}</div> : undefined}
    </div>
);

interface WorkLogSelectorProps {
  title: string;
  workLogs: ReportingWorkLog[];
  chipLabel: (workLog: ReportingWorkLog) => string|string[];
  selected?: string[];
  onSelectionChange: (values: string[]) => void;
  workLogFilter?: (workLog: ReportingWorkLog) => boolean;
}

export class WorkLogSelector extends Component<WorkLogSelectorProps, {}> {
  render() {
    const {title, onSelectionChange} = this.props;
    const labels = this.labels;
    return (
        <div className='work-log-selector'>
          <div className='work-log-selector__header' data-work-log-selector-title>{title}</div>
          <div className='work-log-selector__chips'>
            {
              labels.map(this.renderChip)
            }
          </div>
          <div className='work-log-selector__footer'>
            <Button data-button-select-none size='small' onClick={() => onSelectionChange([])}>
              <ClearIcon />
              None
            </Button>
            <Button data-button-select-all size='small' onClick={() => onSelectionChange(labels)}>
              <AddIcon />
              All
            </Button>
          </div>
        </div>
    );
  }

  private renderChip = (label: string, idx: number) => {
    const {selected = []} = this.props;
    const isSelected = selected.includes(label);
    const workload = this.workloadForLabel(label);
    return (
        <Chip key={idx}
              label={<ChipLabel label={label} workload={workload}/>}
              color='primary'
              className='chip'
              variant={isSelected ? 'default' : 'outlined'}
              onClick={() => this.onClick(label)}
              data-chip-selected={isSelected}/>
    );
  };

  private workloadForLabel(label: string): number {
    const {workLogs, chipLabel, workLogFilter = () => true} = this.props;
    return workLogs
        .filter(w => chipLabel(w) === label || chipLabel(w).includes(label))
        .filter(workLogFilter)
        .map(w => w.workload)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }

  private onClick(label: string) {
    const {selected = [], onSelectionChange} = this.props;
    return onSelectionChange(xor(selected, [label]));
  }

  private get labels(): string[] {
    const {workLogs, chipLabel} = this.props;
    const labels = workLogs
        .map(chipLabel)
        .map(v => Array.isArray(v) ? v : [v])
        .reduce(((prev, curr) => [...prev, ...curr]), []);
    return uniq(labels);
  }
}
