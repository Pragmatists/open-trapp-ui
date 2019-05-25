import React, {Component} from "react";
import Slider from "@material-ui/lab/Slider";
import './Workload.scss';

interface WorkloadProps {
  readonly hours: number;
  readonly minutes: number;
  readonly onHoursChange: (number) => void;
  readonly onMinutesChange: (number) => void;
}

export class Workload extends Component<WorkloadProps> {
  render() {
    return (
      <div className='workload-selector'>
        <div data-number-of-hours>{this.props.hours} {this.props.hours === 1 ? 'hour' : 'hours'}</div>
        <Slider min={0}
                max={16}
                step={1}
                value={this.props.hours}
                onChange={this.handleHoursChange}
                className='workload-selector__slider slider'
                data-hours-slider />
        <div data-number-of-minutes>{this.props.minutes} minutes</div>
        <Slider min={0}
                max={60}
                step={15}
                value={this.props.minutes}
                onChange={this.handleMinutesChange}
                className='workload-selector__slider slider'
                data-minutes-slider />
      </div>
    );
  }

  private handleHoursChange = (event, value: number) => this.props.onHoursChange(value);

  private handleMinutesChange = (event, value: number) => this.props.onMinutesChange(value);
}
