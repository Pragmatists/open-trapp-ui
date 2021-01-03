import { useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { Workload } from "../workload/Workload";
import { formatWorkload } from '../../../utils/workloadUtils';

interface WorkloadDialogProps {
  open: boolean;
  onClose: (workload?: string) => void;
}

export const WorkloadDialog = ({open, onClose}: WorkloadDialogProps) => {
  const [hours, setHours] = useState(8);
  const [minutes, setMinutes] = useState(0);

  const workload = formatWorkload(hours * 60 + minutes);

  const onSaveClick = () => {
    if (hours > 0 || minutes > 0) {
      onClose(workload);
    }
  };

  return (
        <Dialog open={open} onClose={() => onClose()} fullWidth={true} className='workload-dialog' data-workload-dialog>
          <DialogTitle>Workload</DialogTitle>
          <DialogContent>
            <Workload minutes={minutes}
                      hours={hours}
                      onHoursChange={v => setHours(v)}
                      onMinutesChange={v => setMinutes(v)}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onClose()}>Cancel</Button>
            <Button onClick={onSaveClick} autoFocus color='primary'>Save</Button>
          </DialogActions>
        </Dialog>
    );
}
