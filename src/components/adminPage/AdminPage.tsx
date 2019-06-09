import React, { Component } from 'react';
import { connect } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import './AdminPage.scss';
import Paper from '@material-ui/core/Paper';
import { ServiceAccountsList } from './serviceAccountsList/ServiceAccountsList';
import { loadAuthorizedUsers, loadServiceAccounts } from '../../redux/admin.actions';
import { AuthorizedUserDTO, ServiceAccountDTO } from '../../api/dtos';
import { UsersList } from './usersList/UsersList';


interface AdminPageDataProps {
  serviceAccounts: ServiceAccountDTO[];
  users: AuthorizedUserDTO[];
}

interface AdminPageEventProps {
  init: VoidFunction;
}

type AdminPageProps = AdminPageDataProps & AdminPageEventProps;

class AdminPageComponent extends Component<AdminPageProps, {}> {


  componentDidMount(): void {
    this.props.init();
  }

  render() {
    const {serviceAccounts, users} = this.props;
    return (
        <div className='admin-page'>
          <Grid container justify='center' spacing={3}>
            <Grid item lg={10} md={11} xs={11}>
              <div className='admin-page__header'>
                Service accounts
              </div>
              <Divider variant='fullWidth'/>
              <Paper className='admin-page__content'>
                {
                  serviceAccounts ?
                      <ServiceAccountsList accounts={serviceAccounts}/> :
                      <div className='admin-page__placeholder' data-service-accounts-loading>Loading...</div>
                }
              </Paper>
            </Grid>
            <Grid item lg={10} md={11} xs={11}>
              <div className='admin-page__header'>
                Users
              </div>
              <Divider variant='fullWidth'/>
              <Paper className='admin-page__content'>
                {
                  users ?
                      <UsersList users={users}/> :
                      <div className='admin-page__placeholder' data-authorized-users-loading>Loading...</div>
                }
              </Paper>
            </Grid>
          </Grid>
        </div>
    );
  }
}

function mapStateToProps(state: OpenTrappState): AdminPageDataProps {
  const {serviceAccounts, authorizedUsers} = state.admin;
  return {
    serviceAccounts,
    users: authorizedUsers
  };
}

function mapDispatchToProps(dispatch): AdminPageEventProps {
  return {
    init() {
      dispatch(loadServiceAccounts());
      dispatch(loadAuthorizedUsers());
    }
  };
}

export const AdminPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminPageComponent);
