import React, { useState } from 'react';
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

interface CreatedAccount {
  clientID: string;
  secret: string;
}

const AccountDetails = ({name, clientID, secret}: { name: string, clientID: string, secret: string }) => (
    <DialogContent className='service-account-dialog__content content'>
      <div>Your account <b>{name}</b> has been created.</div>
      <div>Copy credentials from fields below.</div>
      <TextField label='Client ID'
                 className='content__text-field'
                 value={clientID}
                 margin='normal'
                 InputProps={{readOnly: true}}
                 type='text'
                 fullWidth/>
      <TextField label='Secret'
                 className='content__text-field'
                 value={secret}
                 margin='normal'
                 InputProps={{readOnly: true}}
                 type='text'
                 fullWidth/>
    </DialogContent>
);

const DetailsActions = ({onClose}: { onClose: VoidFunction }) => (
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
);

const NameInput = ({name, onChange}: { name: string, onChange: (string) => void }) => (
    <DialogContent className='service-account-dialog__content content'>
      <TextField autoFocus
                 className='content__text-field'
                 value={name}
                 onChange={e => onChange(e.target.value)}
                 margin='normal'
                 label='Account name'
                 type='text'
                 fullWidth/>
    </DialogContent>
);

const NameActions = ({onClose, onCreate, disabled}: { onClose: VoidFunction, onCreate: VoidFunction, disabled: boolean }) => (
    <DialogActions>
      <Button onClick={onClose} data-testid='cancel-button'>Cancel</Button>
      <Button onClick={onCreate} color='primary' data-testid='create-button' disabled={disabled}>Create</Button>
    </DialogActions>
);

export const ServiceAccountDialog = ({open, onClose}: ServiceAccountDialogProps) => {
  const [createdAccount, setCreatedAccount] = useState(undefined as CreatedAccount);
  const [name, setName] = useState('');

  const onCreateClick = () => {
    OpenTrappRestAPI.creteServiceAccount(name)
        .then(a => setCreatedAccount(a));
  };

  const onCloseDialog = () => {
    setName('');
    setCreatedAccount(undefined);
    onClose(isEmpty(name) || !createdAccount ? undefined : name);
  }

  return (
      <Dialog open={open} onClose={onCloseDialog} className='service-account-dialog'>
        <DialogTitle>Create service account</DialogTitle>
        {
          createdAccount
              ? <AccountDetails name={name} clientID={createdAccount.clientID} secret={createdAccount.secret}/>
              : <NameInput name={name} onChange={n => setName(n)}/>}
        {
          createdAccount
              ? <DetailsActions onClose={onCloseDialog}/>
              : <NameActions onClose={onCloseDialog} onCreate={onCreateClick} disabled={isEmpty(name)}/>
        }
      </Dialog>
  );
}
