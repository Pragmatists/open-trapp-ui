import React from "react";
import { Slider } from "@material-ui/core";
import './Workload.scss';

interface Props {
  readonly hours: number;
  readonly minutes: number;
  readonly onHoursChange: (number) => void;
  readonly onMinutesChange: (number) => void;
}

export const Workload = ({hours, minutes, onHoursChange, onMinutesChange}: Props) => (
    <div className='workload-selector' data-workload-selector>
      <div data-number-of-hours>{hours} {hours === 1 ? 'hour' : 'hours'}</div>
      <Slider min={0}
              max={16}
              step={1}
              value={hours}
              onChange={(event, value) => onHoursChange(value)}
              className='workload-selector__slider slider'
              data-hours-slider/>
      <div data-number-of-minutes>{minutes} minutes</div>
      <Slider min={0}
              max={60}
              step={15}
              value={minutes}
              onChange={(event, value) => onMinutesChange(value)}
              className='workload-selector__slider slider'
              data-minutes-slider/>
    </div>
);
