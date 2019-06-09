import React, { Component } from 'react';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import { TableRow } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import { ServiceAccountDTO } from '../../../api/dtos';
import TableBody from '@material-ui/core/TableBody';

interface ServiceAccountsListProps {
  accounts: ServiceAccountDTO[];
}

export class ServiceAccountsList extends Component<ServiceAccountsListProps, {}> {
  render() {
    const {accounts} = this.props;
    return (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account Name</TableCell>
              <TableCell>Client ID</TableCell>
              <TableCell>Owner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map(account => (
                <TableRow key={account.clientID} data-service-account-row>
                  <TableCell data-account-name>{account.name}</TableCell>
                  <TableCell data-account-client-id>{account.clientID}</TableCell>
                  <TableCell data-account-owner>{account.owner}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
    );
  }
}
