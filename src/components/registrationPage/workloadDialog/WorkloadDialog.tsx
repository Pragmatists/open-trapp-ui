import React, {Component} from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import './WorkloadDialog.scss';
import {Workload} from "../workload/Workload";

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
          <Workload minutes={minutes} hours={hours} onHoursChange={this.handleHoursChange} onMinutesChange={this.handleMinutesChange} />
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

  private handleHoursChange = (value: number) => this.setState({
    hours: value
  });

  private handleMinutesChange = (value: number) => this.setState({
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
