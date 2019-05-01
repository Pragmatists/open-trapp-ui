import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Dialog } from '@material-ui/core';
import { isEqual, trim, isEmpty } from 'lodash';
import { EditedWorkLog, ReportingWorkLog } from '../reporting.model';
import TextField from '@material-ui/core/TextField';
import './EditWorkLogDialog.scss'
import { formatWorkload } from '../../../utils/workLogUtils';
import { TagsAutocompleteInput } from './tagsAutocompleteInput/TagsAutocompleteInput';

interface EditWorkLogDialogProps {
  workLog: ReportingWorkLog;
  tags: string[];
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
    const {open, onClose, workLog, tags} = this.props;
    const {employee = '', day = ''} = workLog || {} as ReportingWorkLog;
    return (
        <Dialog open={open} onClose={() => onClose()} className='edit-work-log'>
          <DialogTitle>Edit worklog entry</DialogTitle>
          <DialogContent className='edit-work-log__content content' data-edit-work-log-dialog-content>
            <TextField className='text-field'
                       label='Workload'
                       value={this.state.workload}
                       onChange={this.onWorkloadChange}
                       data-edit-work-log-workload/>
            <TagsAutocompleteInput value={this.state.projectNames}
                                   tags={tags}
                                   onChange={this.onProjectNamesChange} />
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
    const projectNames = this.state.projectNames
        .split(',')
        .map(trim)
        .filter(v => !isEmpty(v));
    onClose({
      id: workLog.id,
      workload: this.state.workload,
      projectNames
    })
  };

  private onWorkloadChange = (event) => this.setState({
    workload: event.target.value
  });

  private onProjectNamesChange = (value: string) => this.setState({
    projectNames: value
  });
}