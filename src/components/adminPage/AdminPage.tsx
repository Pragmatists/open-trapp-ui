import React, { Component } from 'react';
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

interface AdminPageState {
  serviceAccountDialogOpen: boolean;
}

class AdminPageComponent extends Component<AdminPageProps, AdminPageState> {
  state = {
    serviceAccountDialogOpen: false
  };

  componentDidMount(): void {
    this.props.init();
  }

  render() {
    const {serviceAccounts, users, username, onDeleteServiceAccount} = this.props;
    const {serviceAccountDialogOpen} = this.state;
    return (
        <div className='admin-page'>
          <ServiceAccountDialog open={serviceAccountDialogOpen}
                                onClose={this.onCloseServiceAccountDialog}/>
          <Grid container justify='center' spacing={3}>
            <Grid item lg={10} md={11} xs={11}>
              <div className='admin-page__header'>
                <div>Service accounts</div>
                <CreateButton onClick={this.onOpenServiceAccountDialog} data-create-service-account-button/>
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
                  users ? <UsersList users={users}/> : <LoadingPlaceholder data-authorized-users-loading/>
                }
              </Paper>
            </Grid>
          </Grid>
        </div>
    );
  }

  private onOpenServiceAccountDialog = () => this.setState({
    serviceAccountDialogOpen: true
  });

  private onCloseServiceAccountDialog = (name?: string) => {
    const {onServiceAccountCreated} = this.props;
    this.setState({
      serviceAccountDialogOpen: false
    });
    if (name) {
      onServiceAccountCreated();
    }
  };
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
