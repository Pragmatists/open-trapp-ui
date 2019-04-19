import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { Preset } from '../registration.model';
import { xor, sortBy, trim, uniq, includes } from 'lodash';
import List from '@material-ui/core/List';
import { ListItem } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

interface CreateWorkLogDialogProps {
  onClose: (preset?: Preset) => void;
  open: boolean;
  tags: string[];
}

interface CreateWorkLogDialogState {
  selected: string[];
}

export class CreateWorkLogDialog extends Component<CreateWorkLogDialogProps, CreateWorkLogDialogState> {
  state = {
    selected: []
  };

  render() {
    const {open, onClose, tags = []} = this.props;
    const {selected} = this.state;
    const sortedTags = sortBy(uniq(tags.map(trim)));
    return (
        <Dialog open={open} onClose={() => onClose()} fullWidth={true} data-create-work-log-dialog>
          <DialogTitle>Create Work Log</DialogTitle>
          <DialogContent data-create-work-log-dialog-content>
            <List>
              {sortedTags.map(tag => (
                  <ListItem dense button key={tag}
                            role={undefined}
                            onClick={() => this.handleToggle(tag)}
                            data-tag={tag}>
                    <Checkbox checked={includes(selected, tag)}
                              color='primary'
                              tabIndex={-1}
                              disableRipple />
                    <ListItemText primary={tag}/>
                  </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onClose()} data-cancel-button>
              Cancel
            </Button>
            <Button onClick={this.onSaveClick} color='primary' autoFocus data-save-button>
              Save
            </Button>
          </DialogActions>
        </Dialog>
    );
  }

  private onSaveClick = () => {
    this.props.onClose(new Preset(this.state.selected));
    this.setState({
      selected: []
    });
  };

  private handleToggle(tag: string) {
    this.setState({
      selected: xor(this.state.selected, [tag])
    })
  }
}
