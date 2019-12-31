import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import { TableRow } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import { ServiceAccountDTO } from '../../../api/dtos';
import TableBody from '@material-ui/core/TableBody';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';

interface ServiceAccountsListProps {
  accounts: ServiceAccountDTO[];
  username: string;
  onDelete: (id: string) => void;
}

export const ServiceAccountsList = ({accounts, username, onDelete}: ServiceAccountsListProps) => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Account Name</TableCell>
          <TableCell>Client ID</TableCell>
          <TableCell>Owner</TableCell>
          <TableCell/>
        </TableRow>
      </TableHead>
      <TableBody>
        {accounts.map(account => (
            <ServiceAccountRow key={account.clientID}
                               account={account}
                               username={username}
                               onDelete={onDelete}/>
        ))}
      </TableBody>
    </Table>
);

interface ServiceAccountsRowProps {
  account: ServiceAccountDTO;
  username: string;
  onDelete: (id: string) => void;
}

const ServiceAccountRow = ({account, username, onDelete}: ServiceAccountsRowProps) => (
    <TableRow data-service-account-row>
      <TableCell data-account-name>{account.name}</TableCell>
      <TableCell data-account-client-id>{account.clientID}</TableCell>
      <TableCell data-account-owner>{account.owner}</TableCell>
      <TableCell>
        {
          username === account.owner && <Button onClick={() => onDelete(account.clientID)} data-account-delete-button>
            <DeleteIcon/>
          </Button>
        }
      </TableCell>
    </TableRow>
);
