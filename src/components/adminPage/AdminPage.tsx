import React, { Component } from 'react';
import { connect } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import './AdminPage.scss';
import Paper from '@material-ui/core/Paper';
import { ServiceAccountsList } from './serviceAccountsList/ServiceAccountsList';
import { loadServiceAccounts } from '../../redux/admin.actions';
import { ServiceAccountDTO } from '../../api/dtos';


interface AdminPageDataProps {
  serviceAccounts: ServiceAccountDTO[]
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
    const {serviceAccounts} = this.props;
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
          </Grid>
        </div>
    );
  }
}

function mapStateToProps(state: OpenTrappState): AdminPageDataProps {
  const {serviceAccounts} = state.admin;
  return {
    serviceAccounts
  };
}

function mapDispatchToProps(dispatch): AdminPageEventProps {
  return {
    init() {
      dispatch(loadServiceAccounts());
    }
  };
}

export const AdminPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminPageComponent);
