import React, { Component } from 'react';
import { Paper } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import './WorkLogInput.scss'
import { WorkLogHelpDialog } from "../workLogHelpDialog/WorkLogHelpDialog";
import { ParsedWorkLog, WorkLogExpressionParser } from '../../workLogExpressionParser/WorkLogExpressionParser';

interface WorkLogInputProps {
  workLog: ParsedWorkLog;
  onChange: (workLog: ParsedWorkLog) => void;
}

interface WorkLogInputState {
  helpOpen: boolean;
}

export class WorkLogInput extends Component<WorkLogInputProps, WorkLogInputState> {
  private workLogExpressionParser = new WorkLogExpressionParser();

  state = {
    helpOpen: false
  };

  render() {
    const {workLog} = this.props;
    return (
        <Paper className='work-log-input' elevation={1}>
          <InputBase className='work-log-input__input'
                     placeholder='1d #my-project'
                     value={workLog.expression} onChange={this.onInputChange}/>
          <IconButton className='work-log-input__help' aria-label='Help' onClick={this.handleOpenHelp}>
            <HelpIcon color='secondary'/>
          </IconButton>
          <WorkLogHelpDialog open={this.state.helpOpen} onClose={this.handleCloseHelp}/>
        </Paper>
    );
  }

  private onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) => {
    const {onChange} = this.props;
    const workLog = this.workLogExpressionParser.parse(event.target.value);
    onChange(workLog)
  };

  private handleCloseHelp = () => this.setState({helpOpen: false});

  private handleOpenHelp = () => this.setState({helpOpen: true});
}
