import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Dialog } from '@material-ui/core';
import { isEqual, trim } from 'lodash';
import { EditedWorkLog, ReportingWorkLog } from '../reporting.model';
import TextField from '@material-ui/core/TextField';
import './EditWorkLogDialog.scss'
import { formatWorkload } from '../../../utils/workLogUtils';

interface EditWorkLogDialogProps {
  workLog: ReportingWorkLog;
  onClose: (workLog?: EditedWorkLog) => void;
  open: boolean;
}

interface EditWorkLogDialogState {
  workload: string;
  projectNames: string;
}

export class EditWorkLogDialog extends Component<EditWorkLogDialogProps, EditWorkLogDialogState> {
  constructor(props: Readonly<EditWorkLogDialogProps>) {
    super(props);
    const {workLog} = this.props;
    const {workload, projectNames = []} = workLog || {} as ReportingWorkLog;
    this.state = {
      workload: formatWorkload(workload),
      projectNames: projectNames.join(', ')
    };
  }

  componentDidUpdate(prevProps: Readonly<EditWorkLogDialogProps>, prevState: Readonly<EditWorkLogDialogState>, snapshot?: any): void {
    const {workLog} = this.props;
    const {workload, projectNames = []} = workLog || {} as ReportingWorkLog;
    if (!isEqual(prevProps.workLog, this.props.workLog)) {
      this.setState({
        workload: formatWorkload(workload),
        projectNames: projectNames.join(', ')
      });
    }
  }

  render() {
    const {open, onClose, workLog} = this.props;
    const {employee = '', day = ''} = workLog || {} as ReportingWorkLog;
    return (
        <Dialog open={open} onClose={() => onClose()}>
          <DialogTitle>Edit worklog entry</DialogTitle>
          <DialogContent className='edit-work-log__content content' data-edit-work-log-dialog-content>
            <TextField className='text-field'
                       label='Workload'
                       value={this.state.workload}
                       onChange={this.onWorkloadChange}
                       data-edit-work-log-workload/>
            <TextField className='text-field'
                       label='Project'
                       value={this.state.projectNames}
                       onChange={this.onProjectNamesChange}
                       data-edit-work-log-project/>
            <TextField className='text-field' label='Employee' value={employee} disabled data-edit-work-log-employee/>
            <TextField className='text-field' label='Date' value={day} disabled data-edit-work-log-date/>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onClose()} data-cancel-button>
              Cancel
            </Button>
            <Button onClick={this.onUpdateClick} color='primary' autoFocus data-update-button>
              Update
            </Button>
          </DialogActions>
        </Dialog>
    );
  }

  private onUpdateClick = () => {
    const {workLog, onClose} = this.props;
    onClose({
      id: workLog.id,
      workload: this.state.workload,
      projectNames: this.state.projectNames.split(',').map(trim)
    })
  };

  private onWorkloadChange = (event) => this.setState({
    workload: event.target.value
  });

  private onProjectNamesChange = (event) => this.setState({
    projectNames: event.target.value
  });
}