import React, { Component } from 'react';
import { Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { isEmpty } from 'lodash';
import TextField from '@material-ui/core/TextField';
import { OpenTrappRestAPI } from '../../../api/OpenTrappAPI';
import './ServiceAccountDialog.scss';

interface ServiceAccountDialogProps {
  open: boolean;
  onClose: (name?: string) => void;
}

interface ServiceAccountDialogState {
  name: string;
  createdAccount?: {
    clientID: string;
    secret: string;
  }
}

export class ServiceAccountDialog extends Component<ServiceAccountDialogProps, ServiceAccountDialogState> {
  state = {
    name: '',
    createdAccount: undefined
  };

  render() {
    const {createdAccount} = this.state;
    return (
        <Dialog open={this.props.open} onClose={this.onCloseDialog} className='service-account-dialog'>
          <DialogTitle>Create service account</DialogTitle>
          {createdAccount ? this.renderAccountDetails() : this.renderNameInput()}
          {createdAccount ? this.renderDetailsActions() : this.renderNameActions()}
        </Dialog>
    );
  }

  private renderNameInput() {
    return (
        <DialogContent className='service-account-dialog__content content'>
          <TextField autoFocus
                     className='content__text-field'
                     value={this.state.name}
                     onChange={e => this.setState({name: e.target.value})}
                     margin='normal'
                     label='Account name'
                     type='text'
                     fullWidth/>
        </DialogContent>
    );
  }

  private renderAccountDetails() {
    const {name, createdAccount} = this.state;
    return (
        <DialogContent className='service-account-dialog__content content'>
          <div>Your account <b>{name}</b> has been created.</div>
          <div>Copy credentials from fields below.</div>
          <TextField label='Client ID'
                     className='content__text-field'
                     value={createdAccount.clientID}
                     margin='normal'
                     InputProps={{readOnly: true}}
                     type='text'
                     fullWidth
                     data-client-id-field/>
          <TextField label='Secret'
                     className='content__text-field'
                     value={createdAccount.secret}
                     margin='normal'
                     InputProps={{readOnly: true}}
                     type='text'
                     fullWidth
                     data-client-secret-field/>
        </DialogContent>
    );
  }

  private renderNameActions() {
    return (
        <DialogActions>
          <Button onClick={this.onCloseDialog} data-testid='cancel-button'>
            Cancel
          </Button>
          <Button onClick={this.onCreateClick} color='primary' data-testid='create-button' disabled={isEmpty(this.state.name)}>
            Create
          </Button>
        </DialogActions>
    );
  }

  private renderDetailsActions() {
    return (
        <DialogActions>
          <Button onClick={this.onCloseDialog} data-close-button>Close</Button>
        </DialogActions>
    );
  }

  private onCreateClick = () => {
    const {name} = this.state;
    OpenTrappRestAPI.creteServiceAccount(name)
        .then(createdAccount => this.setState({createdAccount}));
  };

  private onCloseDialog = () => {
    const {onClose} = this.props;
    const name = isEmpty(this.state.name) || !this.state.createdAccount ? undefined : this.state.name;
    this.setState({
      name: '',
      createdAccount: undefined
    });
    onClose(name);
  }
}
