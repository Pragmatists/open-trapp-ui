import React, { Component } from 'react';
import { AuthorizedUserDTO } from '../../../api/dtos';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import { TableRow } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

interface UsersListProps {
  users: AuthorizedUserDTO[];
  onUpdate: (user: AuthorizedUserDTO) => void;
}

export class UsersList extends Component<UsersListProps, {}> {
  render() {
    const {users} = this.props;
    return (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
                <AuthorizedUserRow key={user.name} user={user}/>
            ))}
          </TableBody>
        </Table>
    );
  }
}

const AuthorizedUserRow = ({user}: {user: AuthorizedUserDTO}) => (
    <TableRow data-authorized-user-row>
      <TableCell data-user-name>{user.name}</TableCell>
      <TableCell data-user-email>{user.email}</TableCell>
      <TableCell data-user-roles>{user.roles.join(', ')}</TableCell>
    </TableRow>
);
