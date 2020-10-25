import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { Grid } from '@material-ui/core';
import './AdminPage.scss';
import Paper from '@material-ui/core/Paper';
import { ServiceAccountsList } from './serviceAccountsList/ServiceAccountsList';
import { deleteServiceAccount, loadAuthorizedUsers, loadServiceAccounts } from '../../redux/admin.actions';
import { UsersList } from './usersList/UsersList';
import Button from '@material-ui/core/Button';
import { ServiceAccountDialog } from './serviceAccountDialog/ServiceAccountDialog';

export const AdminPage = () => {
  const [serviceAccountDialogOpen, setServiceAccountDialogOpen] = useState(false);
  const serviceAccounts = useSelector((state: OpenTrappState) => state.admin?.serviceAccounts);
  const users = useSelector((state: OpenTrappState) => state.admin?.authorizedUsers);
  const username = useSelector((state: OpenTrappState) => state.authentication?.user?.name);
  const dispatch = useDispatch()
  const stableDispatch = useCallback(dispatch, [])
  useEffect(() => {
    stableDispatch(loadServiceAccounts());
    stableDispatch(loadAuthorizedUsers());
  }, [stableDispatch])
  const onOpenServiceAccountDialog = () => setServiceAccountDialogOpen(true)

  const onCloseServiceAccountDialog = (name?: string) => {
    setServiceAccountDialogOpen(false);
    if (name) {
      dispatch(loadServiceAccounts());
    }
  };

  return (
      <div className='admin-page'>
        <ServiceAccountDialog open={serviceAccountDialogOpen} onClose={onCloseServiceAccountDialog}/>
        <Grid container justify='center' spacing={3}>
          <Grid item lg={10} md={11} xs={11}>
            <div className='admin-page__header'>
              <div>Service accounts</div>
              <CreateButton onClick={onOpenServiceAccountDialog} data-create-service-account-button/>
            </div>
            <Paper className='admin-page__content'>
              {
                serviceAccounts ?
                    <ServiceAccountsList accounts={serviceAccounts} username={username} onDelete={id => dispatch(deleteServiceAccount(id))}/> :
                    <LoadingPlaceholder >Loading accounts...</LoadingPlaceholder>
              }
            </Paper>
          </Grid>
          <Grid item lg={10} md={11} xs={11}>
            <div className='admin-page__header'>Users</div>
            <Paper className='admin-page__content'>
              {
                users ? <UsersList users={users}/> : <LoadingPlaceholder>Loading users...</LoadingPlaceholder>
              }
            </Paper>
          </Grid>
        </Grid>
      </div>
  );
}

const LoadingPlaceholder = ({children}) => (
    <div className='admin-page__placeholder'>{children}</div>
);

const CreateButton = ({onClick}: { onClick: VoidFunction }) => (
    <Button variant='contained' color='primary' size='small' onClick={onClick}>Create</Button>
);
