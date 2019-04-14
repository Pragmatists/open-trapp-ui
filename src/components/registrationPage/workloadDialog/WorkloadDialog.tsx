import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import './WorkloadDialog.scss';
import Slider from '@material-ui/lab/Slider';

interface WorkloadDialogProps {
  open: boolean;
  onClose: (workload?: string) => void;
}

interface WorkloadDialogState {
  hours: number;
  minutes: number;
}

export class WorkloadDialog extends Component<WorkloadDialogProps, WorkloadDialogState> {
  state = {
    hours: 8,
    minutes: 0
  };

  render() {
    const {open, onClose} = this.props;
    const {hours, minutes} = this.state;
    return (
        <Dialog open={open} onClose={() => onClose()} fullWidth={true} className='workload-dialog' data-workload-dialog>
          <DialogTitle>Workload</DialogTitle>
          <DialogContent data-workload-dialog-content>
            <div data-number-of-hours>{hours} {hours === 1 ? 'hour' : 'hours'}</div>
            <Slider min={0}
                    max={16}
                    step={1}
                    value={hours}
                    onChange={this.onHoursChange}
                    className='workload-dialog__slider slider'
                    data-hours-slider/>
            <div data-number-of-minutes>{minutes} minutes</div>
            <Slider min={0}
                    max={60}
                    step={15}
                    value={minutes}
                    onChange={this.onMinutesChange}
                    className='workload-dialog__slider slider'
                    data-minutes-slider/>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onClose()} data-cancel-button>
              Cancel
            </Button>
            <Button onClick={this.onSaveClick} autoFocus color='primary' data-save-button>
              Save
            </Button>
          </DialogActions>
        </Dialog>
    );
  }

  private onSaveClick = () => {
    const {hours, minutes} = this.state;
    if (hours > 0 || minutes > 0) {
      this.props.onClose(this.workload);
    }
  };

  private onHoursChange = (event, value: number) => this.setState({
    hours: value
  });

  private onMinutesChange = (event, value: number) => this.setState({
    minutes: value
  });

  private get workload(): string {
    const {hours, minutes} = this.state;
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    }
    return '';
  }
}
