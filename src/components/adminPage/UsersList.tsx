import { AuthorizedUserDTO } from '../../api/dtos';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import { TableRow } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

interface UsersListProps {
  users: AuthorizedUserDTO[];
}

export const UsersList = ({users}: UsersListProps) => (
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

const AuthorizedUserRow = ({user}: { user: AuthorizedUserDTO }) => (
    <TableRow data-testid='authorized-user-row'>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.roles.join(', ')}</TableCell>
    </TableRow>
);
