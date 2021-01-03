import { ChangeEvent, useState } from 'react';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import { Month } from '../../../utils/Month';
import { BulkEditQuery } from './BulkEditQuery';
import { OpenTrappRestAPI } from '../../../api/OpenTrappAPI';
import './BulkEditDialog.scss';
import { BulkEditHint } from './BulkEditHint';
import { BulkEditDTO } from '../../../api/dtos';

interface BulkEditDialogProps {
  username: string;
  selection: {tags: string[], employees: string[], month: {year: number, month: number}};
  userTags: string[];
  onEdit: (editDTO: BulkEditDTO) => void;
}

export const BulkEditDialog = ({username, selection, userTags, onEdit}: BulkEditDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState(new BulkEditQuery());
  const [affectedEntries, setAffectedEntries] = useState(undefined as number);

  const initialQuery = BulkEditQuery.fromSelection(
      selection.tags ? selection.tags : userTags,
      selection.employees ? selection.employees : [username],
      new Month(selection.month.year, selection.month.month)
  );

  const validateQuery = (query: BulkEditQuery) => {
    OpenTrappRestAPI.validateBulkEditQuery(query.encodedQuery)
        .then(affectedEntries => setAffectedEntries(affectedEntries.entriesAffected));
  }

  const handleExpressionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(new BulkEditQuery(query.query, event.target.value));
  };

  const handleOpenDialog = () => {
    setQuery(initialQuery);
    setDialogOpen(true);
    validateQuery(initialQuery);
  };

  const handleCloseDialog = () => setDialogOpen(false);

  const handleUpdate = () => {
    onEdit({query: query.query, expression: query.expression});
    handleCloseDialog();
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = new BulkEditQuery(event.target.value, query.expression);
    setAffectedEntries(undefined);
    setQuery(newQuery);
    validateQuery(newQuery);
  };

  return (
      <div>
        <Button onClick={handleOpenDialog}>
          <EditIcon/>
          Bulk edit
        </Button>
        <Dialog open={dialogOpen} onClose={handleCloseDialog} className='bulk-edit' classes={{paper: 'max-width: 40em'}}>
          <DialogTitle>Bulk edit</DialogTitle>
          <DialogContent className='bulk-edit__content content'>
            <TextField className='text-field'
                       label='Query'
                       value={query.query}
                       onChange={handleQueryChange}
                       data-testid='bulk-edit-query'/>
            <TextField className='text-field'
                       label='Expression'
                       placeholder='-#vacation to remove and +#sick to add tag'
                       value={query.expression}
                       onChange={handleExpressionChange}
                       data-testid='bulk-edit-expression'/>
          </DialogContent>
          <BulkEditHint entriesAffected={affectedEntries} className='content__hint'/>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button color='primary' onClick={handleUpdate}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>
  );
}
