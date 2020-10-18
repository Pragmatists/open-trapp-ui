import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { Grid } from '@material-ui/core';
import './AdminPage.scss';
import Paper from '@material-ui/core/Paper';
import { ServiceAccountsList } from './serviceAccountsList/ServiceAccountsList';
import { deleteServiceAccount, loadAuthorizedUsers, loadServiceAccounts } from '../../redux/admin.actions';
import { AuthorizedUser, AuthorizedUserDTO, ServiceAccountDTO } from '../../api/dtos';
import { UsersList } from './usersList/UsersList';
import Button from '@material-ui/core/Button';
import { ServiceAccountDialog } from './serviceAccountDialog/ServiceAccountDialog';

interface AdminPageDataProps {
  serviceAccounts: ServiceAccountDTO[];
  users: AuthorizedUserDTO[];
  username: string;
}

interface AdminPageEventProps {
  init: VoidFunction;
  onServiceAccountCreated: VoidFunction;
  onDeleteServiceAccount: (id: string) => void;
}

type AdminPageProps = AdminPageDataProps & AdminPageEventProps;

const AdminPageComponent = ({init, onServiceAccountCreated, serviceAccounts, users, username, onDeleteServiceAccount}: AdminPageProps) => {
  const [serviceAccountDialogOpen, setServiceAccountDialogOpen] = useState(false);
  useEffect(() => init(), [])
  const onOpenServiceAccountDialog = () => setServiceAccountDialogOpen(true)

  const onCloseServiceAccountDialog = (name?: string) => {
    setServiceAccountDialogOpen(false);
    if (name) {
      onServiceAccountCreated();
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
                    <ServiceAccountsList accounts={serviceAccounts} username={username} onDelete={onDeleteServiceAccount}/> :
                    <LoadingPlaceholder data-service-accounts-loading/>
              }
            </Paper>
          </Grid>
          <Grid item lg={10} md={11} xs={11}>
            <div className='admin-page__header'>Users</div>
            <Paper className='admin-page__content'>
              {
                users ? <UsersList users={users}/> : <LoadingPlaceholder data-users-loading/>
              }
            </Paper>
          </Grid>
        </Grid>
      </div>
  );
}

const LoadingPlaceholder = () => (
    <div className='admin-page__placeholder'>Loading...</div>
);

const CreateButton = ({onClick}: { onClick: VoidFunction }) => (
    <Button variant='contained' color='primary' size='small' onClick={onClick}>Create</Button>
);

function mapStateToProps(state: OpenTrappState): AdminPageDataProps {
  const {serviceAccounts, authorizedUsers} = state.admin;
  const {user = {} as AuthorizedUser} = state.authentication;
  return {
    serviceAccounts,
    users: authorizedUsers,
    username: user.name
  };
}

function mapDispatchToProps(dispatch): AdminPageEventProps {
  return {
    init() {
      dispatch(loadServiceAccounts());
      dispatch(loadAuthorizedUsers());
    },
    onServiceAccountCreated() {
      dispatch(loadServiceAccounts());
    },
    onDeleteServiceAccount(id: string) {
      dispatch(deleteServiceAccount(id));
    }
  };
}

export const AdminPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminPageComponent);
