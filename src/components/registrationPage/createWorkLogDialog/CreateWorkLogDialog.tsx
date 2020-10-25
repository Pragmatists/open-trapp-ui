import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { xor, sortBy, trim, uniq, includes, isEmpty } from 'lodash';
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

interface CreateWorkLogDialogState {
  selected: string[];
  view: View;
  hours: number;
  minutes: number;
}

export class CreateWorkLogDialog extends Component<CreateWorkLogDialogProps, CreateWorkLogDialogState> {
  state = {
    selected: [],
    view: View.TAGS,
    hours: 8,
    minutes: 0
  };

  render() {
    const {open, onClose, tags = []} = this.props;
    const {selected, view, hours, minutes} = this.state;
    const sortedTags = sortBy(uniq(tags.map(trim)));
    return (
        <Dialog open={open} onClose={() => onClose()} fullWidth={true} data-create-work-log-dialog>
          <DialogTitle>Create Work Log</DialogTitle>
          <DialogContent data-create-work-log-dialog-content>
            {view === View.TAGS ?
                <TagList tags={sortedTags} selected={selected} onClick={tag => this.handleToggle(tag)}/> :
                <Workload hours={hours} minutes={minutes} onHoursChange={this.handleHoursChange} onMinutesChange={this.handleMinutesChange}/>
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onClose()} data-cancel-button>
              Cancel
            </Button>
            {view === View.TAGS && <Button onClick={this.onNextClick} disabled={isEmpty(selected)} color='primary' autoFocus data-next-button>
              Next
            </Button>}
            {view === View.WORKLOAD && <Button onClick={this.onSaveClick} color='primary' autoFocus data-save-button>
              Save
            </Button>}
          </DialogActions>
        </Dialog>
    );
  }

  private onSaveClick = () => {
    this.props.onClose(this.state.selected, this.workload);
    this.setState({
      selected: [],
      view: View.TAGS,
      hours: 8,
      minutes: 0
    });
  };

  private onNextClick = () => {
    this.setState({
      view: View.WORKLOAD
    });
  };

  private handleToggle(tag: string) {
    this.setState({
      selected: xor(this.state.selected, [tag])
    })
  }

  private handleHoursChange = (value: number) => this.setState({
    hours: value
  });

  private handleMinutesChange = (value: number) => this.setState({
    minutes: value
  });

  private get workload(): string {
    const {hours, minutes} = this.state;
    return formatWorkload(hours * 60 + minutes);
  }
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
