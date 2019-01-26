import React, {Component} from 'react';
import {Paper} from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import './WorkLogInput.css'
import {WorkLogHelpDialog} from "../workLogHelpDialog/WorkLogHelpDialog";

interface WorkLogInputState {
    helpOpen: boolean;
}

export class WorkLogInput extends Component<{}, WorkLogInputState> {
    state = {
        helpOpen: false
    };

    render() {
        return (
            <Paper className='work-log-input' elevation={1}>
                <InputBase className='work-log-input__input' placeholder='1d #my-project' />
                <IconButton className='work-log-input__help' aria-label='Help' onClick={this.handleOpenHelp}>
                    <HelpIcon color='secondary'/>
                </IconButton>
                <WorkLogHelpDialog open={this.state.helpOpen} onClose={this.handleCloseHelp}/>
            </Paper>
        );
    }

    private handleCloseHelp = () => this.setState({helpOpen: false});

    private handleOpenHelp = () => this.setState({helpOpen: true});
}
