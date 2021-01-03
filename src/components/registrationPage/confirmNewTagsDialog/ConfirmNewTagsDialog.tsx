import { ParsedWorkLog } from '../../../workLogExpressionParser/ParsedWorkLog';
import { Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

interface ConfirmNewTagsDialogProps {
  workLog: ParsedWorkLog;
  newTags: string[];
  onClose: (workLog: ParsedWorkLog, result: boolean) => void;
  open: boolean;
}

export const ConfirmNewTagsDialog = ({open, newTags, onClose, workLog}: ConfirmNewTagsDialogProps) => (
    <Dialog open={open} onClose={() => onClose(workLog, false)}>
      <DialogTitle>New tags will be created</DialogTitle>
      <DialogContent data-testid='confirm-new-tags'>
        <p>
          This action will add new {newTags.length > 1 ? ' tags' : 'tag'}: <strong>{newTags.join(', ')}</strong>.
        </p>
        <p>Make sure you really want to do this!</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(workLog, false)} data-testid='cancel-new-tags-button'>
          Cancel
        </Button>
        <Button onClick={() => onClose(workLog, true)} color='primary' autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
);
