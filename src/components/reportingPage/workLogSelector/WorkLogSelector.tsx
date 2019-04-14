import React, { Component } from 'react';
import './WorkLogSelector.scss';
import { Chip } from '@material-ui/core';
import { isArray, chain, xor, includes } from 'lodash';
import { ReportingWorkLog } from '../reporting.model';
import { formatWorkload } from '../../../utils/workLogUtils';

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
  chipLabel: (workLog: ReportingWorkLog) => any;
  selected?: string[];
  onSelectionChange: (values: string[]) => void;
  workLogFilter?: (workLog: ReportingWorkLog) => boolean;
}

export class WorkLogSelector extends Component<WorkLogSelectorProps, {}> {
  render() {
    const {title} = this.props;
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

          </div>
        </div>
    );
  }

  private renderChip = (label: string, idx: number) => {
    const {selected = []} = this.props;
    const isSelected = includes(selected, label);
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

  private workloadForLabel(label: string) {
    const {workLogs, chipLabel, workLogFilter = () => true} = this.props;
    return chain(workLogs)
        .filter(w => chipLabel(w) === label || includes(chipLabel(w), label))
        .filter(workLogFilter)
        .map(w => w.workload)
        .sum()
        .value();
  }

  private onClick(label: string) {
    const {selected = [], onSelectionChange} = this.props;
    return onSelectionChange(xor(selected, [label]));
  }

  private get labels(): string[] {
    const {workLogs, chipLabel} = this.props;
    return chain(workLogs)
        .map(chipLabel)
        .map(v => isArray(v) ? v : [v])
        .flatten()
        .uniq()
        .value();
  }
}
