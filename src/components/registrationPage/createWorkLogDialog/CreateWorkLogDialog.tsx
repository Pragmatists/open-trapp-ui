import React, { useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { includes, isEmpty, sortBy, trim, uniq, xor } from 'lodash';
import List from '@material-ui/core/List';
import { ListItem } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import { Workload } from '../workload/Workload';
import { formatWorkload } from '../../../utils/workLogUtils';

interface CreateWorkLogDialogProps {
  onClose: (tags?: string[], workload?: string) => void;
  open: boolean;
  tags: string[];
}

enum View {
  TAGS,
  WORKLOAD
}

export const CreateWorkLogDialog = ({open, onClose, tags = []}: CreateWorkLogDialogProps) => {
  const [selected, setSelected] = useState([]);
  const [view, setView] = useState(View.TAGS);
  const [hours, setHours] = useState(8);
  const [minutes, setMinutes] = useState(0);

  const workload = formatWorkload(hours * 60 + minutes);
  const sortedTags = sortBy(uniq(tags.map(trim)));

  const onSaveClick = () => {
    onClose(selected, workload);
    setSelected([]);
    setView(View.TAGS);
    setHours(8);
    setMinutes(0);
  };

  return (
      <Dialog open={open} onClose={() => onClose()} fullWidth={true}>
        <DialogTitle>Create Work Log</DialogTitle>
        <DialogContent>
          {view === View.TAGS ?
              <TagList tags={sortedTags} selected={selected} onClick={t => setSelected(xor(selected, [t]))}/> :
              <Workload hours={hours} minutes={minutes} onHoursChange={v => setHours(v)} onMinutesChange={v => setMinutes(v)}/>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>Cancel</Button>
          {view === View.TAGS && <Button onClick={() => setView(View.WORKLOAD)} disabled={isEmpty(selected)} color='primary' autoFocus>
              Next
          </Button>}
          {view === View.WORKLOAD && <Button onClick={onSaveClick} color='primary' autoFocus>Save</Button>}
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
                      disableRipple/>
            <ListItemText primary={tag}/>
          </ListItem>
      ))}
    </List>
);
