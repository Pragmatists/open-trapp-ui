import React, { ChangeEvent, Component } from 'react';
import { connect } from 'react-redux';
import { OpenTrappState } from '../../../redux/root.reducer';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import { Month } from '../../../utils/Month';
import { AffectedEntriesDTO, ReportingWorkLogDTO } from '../../../api/dtos';
import { chain } from 'lodash';
import { BulkEditQuery } from './BulkEditQuery';
import { OpenTrappRestAPI } from '../../../api/OpenTrappAPI';
import './BulkEditDialog.scss';
import { bulkEditWorkLogs } from '../../../redux/workLog.actions';
import { BulkEditHint } from './BulkEditHint';

interface BulkEditDialogDataProps {
  query: BulkEditQuery;
}

interface BulkEditDialogEventProps {
  onBulkEdit: (query: BulkEditQuery) => void;
  validateQuery: (query: BulkEditQuery) => Promise<AffectedEntriesDTO>;
}

type BulkEditDialogProps = BulkEditDialogDataProps & BulkEditDialogEventProps;

interface BulkEditDialogState {
  dialogOpen: boolean;
  query: BulkEditQuery;
  affectedEntries?: number;
}

class BulkEditDialogComponent extends Component<BulkEditDialogProps, BulkEditDialogState> {
  state = {
    dialogOpen: false,
    query: new BulkEditQuery(),
    affectedEntries: undefined
  };

  render() {
    const {query, affectedEntries} = this.state;
    return (
        <div>
          <Button onClick={this.handleOpenDialog} data-bulk-edit-open-button>
            <EditIcon/>
            Bulk edit
          </Button>
          <Dialog open={this.state.dialogOpen} onClose={this.handleCloseDialog} className='bulk-edit' classes={{paper: 'max-width: 40em'}}>
            <DialogTitle>Bulk edit</DialogTitle>
            <DialogContent className='bulk-edit__content content'>
              <TextField className='text-field'
                         label='Query'
                         value={query.query}
                         onChange={this.handleQueryChange}
                         data-bulk-edit-query/>
              <TextField className='text-field'
                         label='Expression'
                         placeholder='-#vacation to remove and +#sick to add tag'
                         value={query.expression}
                         onChange={this.handleExpressionChange}
                         data-bulk-edit-expression/>
            </DialogContent>
            <BulkEditHint entriesAffected={affectedEntries} className='content__hint'/>
            <DialogActions>
              <Button onClick={this.handleCloseDialog}>Cancel</Button>
              <Button color='primary' onClick={this.handleUpdate} data-bulk-edit-update-button>Update</Button>
            </DialogActions>
          </Dialog>
        </div>
    );
  }

  private handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {expression} = this.state.query;
    const query = new BulkEditQuery(event.target.value, expression);
    this.setState({
      query,
      affectedEntries: undefined
    });
    this.validateQuery(query);
  };

  private handleExpressionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {query} = this.state.query;
    this.setState({
      query: new BulkEditQuery(query, event.target.value)
    })
  };

  private handleCloseDialog = () => this.setState({dialogOpen: false});

  private handleOpenDialog = () => {
    this.setState({
      dialogOpen: true,
      query: this.props.query,
    });
    this.validateQuery(this.props.query);
  };

  private handleUpdate = () => {
    const {onBulkEdit} = this.props;
    onBulkEdit(this.state.query);
    this.handleCloseDialog();
  };

  private validateQuery = (query: BulkEditQuery) => {
    const {validateQuery} = this.props;
    validateQuery(query)
        .then(affectedEntries => this.setState({
          affectedEntries: affectedEntries.entriesAffected
        }));
  }
}

function tagsForUser(workLogs: ReportingWorkLogDTO[], username: string): string[] {
  return chain(workLogs)
      .filter(w => w.employee === username)
      .map(w => w.projectNames)
      .flatten()
      .uniq()
      .value();
}

function mapStateToProps(state: OpenTrappState): BulkEditDialogDataProps {
  const {selectedTags, selectedEmployees} = state.reporting;
  const {year, month} = state.calendar.selectedMonth;
  const {name} = state.authentication.user;
  const {workLogs = []} = state.workLog;
  return {
    query: BulkEditQuery.fromSelection(
        selectedTags ? selectedTags : tagsForUser(workLogs, name),
        selectedEmployees ? selectedEmployees : [name],
        new Month(year, month)
    )
  };
}

function mapDispatchToProps(dispatch): BulkEditDialogEventProps {
  return {
    onBulkEdit(query: BulkEditQuery) {
      dispatch(bulkEditWorkLogs({query: query.query, expression: query.expression}))
    },
    validateQuery(query: BulkEditQuery) {
      return OpenTrappRestAPI.validateBulkEditQuery(query.encodedQuery);
    }
  };
}

export const BulkEditDialog = connect(
    mapStateToProps,
    mapDispatchToProps
)(BulkEditDialogComponent);