import {useEffect, useState} from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import {includes, isEmpty, sortBy, trim, uniq, xor} from 'lodash';
import List from '@material-ui/core/List';
import {ListItem} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import {Workload} from '../workload/Workload';
import {formatWorkload} from '../../../utils/workloadUtils';
import TextField from "@material-ui/core/TextField";

interface CreateWorkLogDialogProps {
  onCancel: () => void;
  onSave: (tags: string[], workload: string, description?: string) => void;
  open: boolean;
  tags: string[];
  selectedTags?: string[];
}

enum View {
  TAGS,
  WORKLOAD
}

const validateDescription = (description: string) => {
  if (isEmpty(trim(description))) {
    return 'Description cannot be empty'
  } else if (description.length > 1000) {
    return 'Description cannot be longer than 1000 characters'
  }
  return undefined
}

export const CreateWorkLogDialog = ({open, onCancel, onSave, tags = [], selectedTags}: CreateWorkLogDialogProps) => {
  const [selected, setSelected] = useState([]);
  const [view, setView] = useState(View.TAGS);
  const [hours, setHours] = useState(8);
  const [minutes, setMinutes] = useState(0);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState(undefined);

  useEffect(() => {
    if (selectedTags) {
      setSelected(selectedTags);
      setView(View.WORKLOAD);
    }
  }, [selectedTags]);

  const workload = formatWorkload(hours * 60 + minutes);
  const sortedTags = sortBy(uniq(tags.map(trim)));
  const selfDevSelected = selected.includes('self-dev');

  const handleCancel = () => {
    onCancel();
    setSelected([]);
    setView(View.TAGS);
    setHours(8);
    setMinutes(0);
    setDescription('');
    setDescriptionError(undefined);
  }

  const handleSave = () => {
    const errorMessage = selfDevSelected ? validateDescription(description) : undefined;
    if (!errorMessage) {
      onSave(selected, workload, selfDevSelected ? trim(description) : undefined);
      handleCancel()
    } else {
      setDescriptionError(errorMessage);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescriptionError(validateDescription(value));
    setDescription(value)
  }

  return (
      <Dialog open={open} onClose={handleCancel} fullWidth={true}>
        <DialogTitle>Create Work Log</DialogTitle>
        <DialogContent>
          {
            view === View.TAGS && <TagList tags={sortedTags} selected={selected} onClick={t => setSelected(xor(selected, [t]))} />
          }
          {
            view === View.WORKLOAD && <Workload hours={hours} minutes={minutes} onHoursChange={v => setHours(v)} onMinutesChange={v => setMinutes(v)} />
          }
          {
            view === View.WORKLOAD && selfDevSelected && <TextField aria-label='self-dev description'
                                                                    label='Self-dev description'
                                                                    multiline
                                                                    type='text'
                                                                    value={description}
                                                                    onChange={e => handleDescriptionChange(e.target.value)}
                                                                    size='medium'
                                                                    error={!!descriptionError}
                                                                    helperText={descriptionError}
                                                                    fullWidth />
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          {view === View.TAGS && <Button onClick={() => setView(View.WORKLOAD)} disabled={isEmpty(selected)} color='primary' autoFocus>
            Next
          </Button>}
          {view === View.WORKLOAD && <Button onClick={handleSave} color='primary' autoFocus>Save</Button>}
        </DialogActions>
      </Dialog>
  );
}

const TagList = ({tags, selected, onClick}: { tags: string[]; selected: string[]; onClick: (tag: string) => void }) => (
    <List>
      {tags.map(tag => (
          <ListItem dense button key={tag}
                    role={undefined}
                    onClick={() => onClick(tag)}
                    data-tag={tag} data-testid='tag'>
            <Checkbox checked={includes(selected, tag)}
                      color='primary'
                      tabIndex={-1}
                      disableRipple />
            <ListItemText primary={tag} />
          </ListItem>
      ))}
    </List>
);
