import React, { Component } from 'react';
import { xor, uniq } from 'lodash';
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

interface WorkLogSelectorState {
  hideIneligible: boolean;
}

export class WorkLogSelector extends Component<WorkLogSelectorProps, WorkLogSelectorState> {

  constructor(props: WorkLogSelectorProps, context: any) {
    super(props, context);
    this.state = {
      hideIneligible: props.hideIneligible
    }
  }

  render() {
    const {title, onSelectionChange} = this.props;
    const {hideIneligible} = this.state;
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
            <Button data-button-ineligible size='small' onClick={this.onIneligibleButtonClick}>
              {hideIneligible ? <VisibilityIcon/> : <VisibilityOffIcon/>}
              {hideIneligible ? 'Show ineligible' : 'Hide ineligible'}
            </Button>
            <Button data-button-select-none size='small' onClick={() => onSelectionChange([])}>
              <ClearIcon/>
              None
            </Button>
            <Button data-button-select-all size='small' onClick={() => onSelectionChange(labels)}>
              <AddIcon/>
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
        <SelectorChip key={idx}
                      label={label}
                      workload={workload}
                      selected={isSelected}
                      onClick={() => this.onClick(label)}/>
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
    const {workLogs, chipLabel, workLogFilter = () => true} = this.props;
    const {hideIneligible} = this.state;
    const labels = workLogs
        .filter(w => !hideIneligible || workLogFilter(w))
        .map(chipLabel)
        .map(v => Array.isArray(v) ? v : [v])
        .reduce(((prev, curr) => [...prev, ...curr]), []);
    return uniq(labels).sort();
  }

  private onIneligibleButtonClick = () => this.setState({
    hideIneligible: !this.state.hideIneligible
  });
}
