import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import './AdminPage.scss';
import Paper from '@material-ui/core/Paper';
import { ServiceAccountsList } from './ServiceAccountsList';
import {
  deleteServiceAccountAction,
  loadAuthorizedUsersAction,
  loadServiceAccountsAction
} from '../../actions/admin.actions';
import { UsersList } from './UsersList';
import Button from '@material-ui/core/Button';
import { ServiceAccountDialog } from './ServiceAccountDialog';

export const AdminPage = () => {
  const [serviceAccountDialogOpen, setServiceAccountDialogOpen] = useState(false);
  const serviceAccounts = useSelector((state: OpenTrappState) => state.admin?.serviceAccounts);
  const users = useSelector((state: OpenTrappState) => state.admin?.authorizedUsers);
  const username = useSelector((state: OpenTrappState) => state.authentication?.user?.name);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadServiceAccountsAction());
    dispatch(loadAuthorizedUsersAction());
  }, [dispatch]);
  const onOpenServiceAccountDialog = () => setServiceAccountDialogOpen(true);

  const onCloseServiceAccountDialog = (name?: string) => {
    setServiceAccountDialogOpen(false);
    if (name) {
      dispatch(loadServiceAccountsAction());
    }
  };

  return (
      <div className='admin-page'>
        <ServiceAccountDialog open={serviceAccountDialogOpen} onClose={onCloseServiceAccountDialog}/>
        <div>
          <div className='admin-page__header'>
            <div>Service accounts</div>
            <Button variant='contained' color='primary' size='small' onClick={onOpenServiceAccountDialog}>Create</Button>
          </div>
          <Paper className='admin-page__content'>
            {
              serviceAccounts ?
                  <ServiceAccountsList accounts={serviceAccounts} username={username}
                                       onDelete={id => dispatch(deleteServiceAccountAction(id))}/> :
                  <LoadingPlaceholder>Loading accounts...</LoadingPlaceholder>
            }
          </Paper>
        </div>
        <div>
          <div className='admin-page__header'>Users</div>
          <Paper className='admin-page__content'>
            {
              users ? <UsersList users={users}/> : <LoadingPlaceholder>Loading users...</LoadingPlaceholder>
            }
          </Paper>
        </div>
      </div>
  );
}

const LoadingPlaceholder = ({children}) => (
    <div className='admin-page__placeholder'>{children}</div>
);
