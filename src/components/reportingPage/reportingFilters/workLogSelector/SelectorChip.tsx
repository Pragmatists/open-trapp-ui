import React from 'react';
import { Chip } from '@material-ui/core';
import { formatWorkload } from '../../../../utils/workLogUtils';

interface ChipLabelProps {
  label: string;
  workload: number;
}

const ChipLabel = ({label, workload}: ChipLabelProps) => (
    <div className='chip-content'>
      <div className='chip-content__label' data-testid='selector-chip-label'>{label}</div>
      {workload > 0 && <div className='chip-content__workload' data-chip-workload>{formatWorkload(workload)}</div>}
    </div>
);

interface SelectorChipProps {
  label: string;
  selected: boolean;
  workload: number;
  onClick: VoidFunction;
}

export const SelectorChip = ({label, workload, selected, onClick}: SelectorChipProps) => (
    <Chip label={<ChipLabel label={label} workload={workload}/>}
          color='primary'
          className='chip'
          variant={selected ? 'default' : 'outlined'}
          onClick={onClick}
          data-testid='selector-chip'
          data-chip-selected={selected}/>
);
