import React, { Component } from 'react';
import { Paper } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import './WorkLogInput.scss'
import { WorkLogHelpDialog } from "../workLogHelpDialog/WorkLogHelpDialog";
import { WorkLogExpressionParser } from '../../../workLogExpressionParser/WorkLogExpressionParser';
import Autosuggest from 'react-autosuggest';
import { Suggestion, SuggestionItem } from '../../Suggestion';
import { isEmpty, noop, difference } from 'lodash';
import { TagsSuggestionFactory } from './TagsSuggestionFactory';
import { DatesSuggestionFactory } from './DatesSuggestionFactory';
import { ConfirmNewTagsDialog } from '../confirmNewTagsDialog/ConfirmNewTagsDialog';
import { ParsedWorkLog } from '../../../workLogExpressionParser/ParsedWorkLog';
import { ValidationStatus } from './ValidationStatus';
import { Preset } from '../registration.model';

interface WorkLogInputProps {
  workLog: ParsedWorkLog;
  tags: string[];
  presets: Preset[];
  onChange: (workLog: ParsedWorkLog) => void;
  onSave: (workLog: ParsedWorkLog) => void;
}

interface WorkLogInputState {
  helpOpen: boolean;
  suggestions: SuggestionItem[];
  newTags: string[];
}

export class WorkLogInput extends Component<WorkLogInputProps, WorkLogInputState> {
  private workLogExpressionParser = new WorkLogExpressionParser();

  state = {
    helpOpen: false,
    suggestions: [],
    newTags: []
  };

  render() {
    const {workLog} = this.props;
    return (
        <Paper className='work-log-input' elevation={1}>
          <Autosuggest
              renderInputComponent={this.renderInputComponent}
              getSuggestionValue={suggestion => suggestion.value}
              inputProps={{
                className: 'work-log-input__input',
                placeholder: '1d #my-project',
                value: workLog.expression,
                onChange: this.handleInputChange,
                onKeyPress: this.handleSubmit,
              }}
              onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
              onSuggestionSelected={this.handleSelected}
              shouldRenderSuggestions={this.shouldRenderSuggestions}
              renderSuggestion={this.renderSuggestion}
              suggestions={this.state.suggestions}
              renderSuggestionsContainer={options => (
                  <Paper {...options.containerProps}>
                    {options.children}
                  </Paper>
              )}
          />
          <ValidationStatus workLog={workLog}/>
          <IconButton aria-label='Help' onClick={this.handleOpenHelp}>
            <HelpIcon color='primary'/>
          </IconButton>
          <WorkLogHelpDialog open={this.state.helpOpen} onClose={this.handleCloseHelp}/>
          <ConfirmNewTagsDialog workLog={workLog}
                                newTags={this.state.newTags}
                                onClose={this.handleConfirmationDialogClose}
                                open={!isEmpty(this.state.newTags)}/>
        </Paper>
    );
  }

  private renderInputComponent = (inputProps) => {
    const {inputRef = noop, ref, ...other} = inputProps;
    return (
        <InputBase fullWidth
                   inputRef={node => {
                     ref(node);
                     inputRef(node);
                   }}
                   {...other}/>
    );
  };

  private renderSuggestion = (suggestion, {query, isHighlighted}) => (
      <Suggestion isHighlighted={isHighlighted} suggestion={suggestion} query={query}/>
  );

  private handleInputChange = (event, {newValue}) => {
    const {onChange} = this.props;
    const workLog = this.workLogExpressionParser.parse(newValue);
    onChange(workLog)
  };

  private handleSubmit = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      const {onSave, workLog, tags} = this.props;
      if (workLog.validate().valid) {
        const newTags = difference(workLog.tags, tags);
        if (isEmpty(newTags)) {
          onSave(workLog);
        } else {
          this.setState({newTags});
        }
      }
    }
  };

  private handleSelected = (event) => event.preventDefault();

  private handleSuggestionsFetchRequested = ({value}) => this.setState({
    suggestions: this.getSuggestions(value)
  });

  private handleSuggestionsClearRequested = () => this.setState({
    suggestions: []
  });

  private handleConfirmationDialogClose = (workLog: ParsedWorkLog, result: boolean) => {
    const {onSave} = this.props;
    this.setState({
      newTags: []
    });
    if (result) {
      onSave(workLog);
    }
  };

  private shouldRenderSuggestions = (text: string) => {
    const lastWord = WorkLogInput.getLastWord(text);
    return lastWord ? lastWord.startsWith('#') || lastWord.startsWith('@') : false;
  };

  private getSuggestions = (text: string) => {
    const {tags, presets} = this.props;
    const lastWord = WorkLogInput.getLastWord(text);
    if (isEmpty(lastWord)) {
      return [];
    } else if (lastWord.startsWith('#')) {
      const tagsSuggestionsFactory = new TagsSuggestionFactory(tags, presets);
      return tagsSuggestionsFactory.suggestions(text, lastWord);
    } else if (lastWord.startsWith('@')) {
      const daysSuggestionsFactory = new DatesSuggestionFactory();
      return daysSuggestionsFactory.suggestions(text, lastWord);
    }
    return [];
  };

  private static getLastWord(text: string) {
    return text.trim()
        .split(/[\s,]+/)
        .pop();
  }

  private handleCloseHelp = () => this.setState({helpOpen: false});

  private handleOpenHelp = () => this.setState({helpOpen: true});
}
