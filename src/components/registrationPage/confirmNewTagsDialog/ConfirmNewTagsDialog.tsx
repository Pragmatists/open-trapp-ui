import React, { Component } from 'react';
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

export class ConfirmNewTagsDialog extends Component<ConfirmNewTagsDialogProps, {}> {

  render() {
    const {open, newTags} = this.props;
    return (
        <Dialog open={open} onClose={() => this.onClose(false)}>
          <DialogTitle>New tags will be created</DialogTitle>
          <DialogContent>
            <p>
              This action will add new {newTags.length > 1 ? ' tags' : 'tag'}: <strong>{newTags.join(', ')}</strong>.
            </p>
            <p>
              Make sure you really want to do this!
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.onClose(false)} data-cancel-button>
              Cancel
            </Button>
            <Button onClick={() => this.onClose(true)} color='secondary' autoFocus data-confirm-button>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
    );
  }

  private onClose(result: boolean) {
    const {workLog, onClose} = this.props;
    onClose(workLog, result);
  };
}
