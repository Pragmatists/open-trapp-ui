import React, { useEffect, useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Dialog } from '@material-ui/core';
import { isEmpty, trim } from 'lodash';
import { EditedWorkLog, ReportingWorkLog } from '../reporting.model';
import TextField from '@material-ui/core/TextField';
import './EditWorkLogDialog.scss'
import { formatWorkload } from '../../../utils/workLogUtils';
import { TagsAutocompleteInput } from './tagsAutocompleteInput/TagsAutocompleteInput';
import { ReportingWorkLogDTO } from '../../../api/dtos';

interface EditWorkLogDialogProps {
  workLog: ReportingWorkLog;
  tags: string[];
  onClose: (workLog?: EditedWorkLog) => void;
  open: boolean;
}

export const EditWorkLogDialog = ({workLog, open, onClose, tags}: EditWorkLogDialogProps) => {
  const [workload, setWorkload] = useState('');
  const [names, setNames] = useState('');
  useEffect(() => {
    const {projectNames = [], workload} = workLog || {} as ReportingWorkLogDTO;
    setNames(projectNames.join(', '));
    setWorkload(formatWorkload(workload));
  }, [workLog]);

  const onUpdateClick = () => {
    const projectNames = names
        .split(',')
        .map(trim)
        .filter(v => !isEmpty(v));
    onClose({
      id: workLog.id,
      workload: workload,
      projectNames
    })
  };

  const {employee = '', day = ''} = workLog || {} as ReportingWorkLog;
  return (
      <Dialog open={open} onClose={() => onClose()} className='edit-work-log'>
        <DialogTitle>Edit worklog entry</DialogTitle>
        <DialogContent className='edit-work-log__content content' data-testid='edit-work-log-dialog-content'>
          <TextField className='text-field'
                     label='Workload'
                     value={workload}
                     onChange={e => setWorkload(e.target.value)}
                     data-testid='edit-workload'/>
          <TagsAutocompleteInput value={names} tags={tags} onChange={v => setNames(v)}/>
          <TextField className='text-field' label='Employee' value={employee} disabled data-testid='edit-employee'/>
          <TextField className='text-field' label='Date' value={day} disabled data-testid='edit-date'/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>Cancel</Button>
          <Button onClick={onUpdateClick} color='primary' autoFocus>Update</Button>
        </DialogActions>
      </Dialog>
  );
}
