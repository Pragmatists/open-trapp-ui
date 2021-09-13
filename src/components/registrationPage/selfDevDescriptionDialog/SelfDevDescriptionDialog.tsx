import { useEffect, useState } from 'react';
import { isEmpty, trim } from 'lodash'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

interface SelfDevDescriptionDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (description: string) => void;
}

const validateDescription = (description: string) => {
  if (isEmpty(trim(description))) {
    return 'Description cannot be empty'
  } else if (description.length > 1000) {
    return 'Description cannot be longer than 1000 characters'
  }
  return undefined
}

export const SelfDevDescriptionDialog = ({open, onCancel, onConfirm}: SelfDevDescriptionDialogProps) => {
  const [description, setDescription] = useState('')
  const [error, setError] = useState(undefined);

  useEffect(() => {
    setDescription('');
    setError(undefined);
  }, [open]);

  const handleConfirm = () => {
    const errorMessage = validateDescription(description)
    if (!errorMessage) {
      onConfirm(trim(description))
    } else {
      setError(errorMessage)
    }
  }

  const handleChange = v => {
    setError(validateDescription(v));
    setDescription(v);
  }

  return (
      <Dialog open={open} onClose={onCancel}>
        <DialogTitle>Self-dev description</DialogTitle>
        <DialogContent>
          <p>Short description is required to report a self-dev</p>
          <TextField aria-label='Self-dev description'
                     multiline
                     type='text'
                     value={description}
                     onChange={e => handleChange(e.target.value)}
                     error={!!error}
                     size='medium'
                     helperText={error}
                     fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
  );
}
