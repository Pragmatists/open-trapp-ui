import React, { Component } from 'react';
import { Paper } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import './WorkLogInput.scss'
import { WorkLogHelpDialog } from "../workLogHelpDialog/WorkLogHelpDialog";
import { ParsedWorkLog, WorkLogExpressionParser } from '../../workLogExpressionParser/WorkLogExpressionParser';
import Autosuggest from 'react-autosuggest';
import { Suggestion, SuggestionItem } from './Suggestion';
import { startsWith, isEmpty, chain, noop } from 'lodash';

interface WorkLogInputProps {
  workLog: ParsedWorkLog;
  tags: string[];
  onChange: (workLog: ParsedWorkLog) => void;
  onSave: (workLog: ParsedWorkLog) => void;
}

interface WorkLogInputState {
  helpOpen: boolean;
  suggestions: SuggestionItem[];
}

export class WorkLogInput extends Component<WorkLogInputProps, WorkLogInputState> {
  private workLogExpressionParser = new WorkLogExpressionParser();

  state = {
    helpOpen: false,
    suggestions: []
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
                onChange: this.onInputChange,
                onKeyPress: this.onSubmit
              }}
              onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
              onSuggestionSelected={this.onSelected}
              shouldRenderSuggestions={this.shouldRenderSuggestions}
              renderSuggestion={this.renderSuggestion}
              suggestions={this.state.suggestions}
              renderSuggestionsContainer={options => (
                  <Paper {...options.containerProps}>
                    {options.children}
                  </Paper>
              )}
          />
          <IconButton className='work-log-input__help' aria-label='Help' onClick={this.handleOpenHelp}>
            <HelpIcon color='secondary'/>
          </IconButton>
          <WorkLogHelpDialog open={this.state.helpOpen} onClose={this.handleCloseHelp}/>
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

  private onInputChange = (event, {newValue}) => {
    const {onChange} = this.props;
    const workLog = this.workLogExpressionParser.parse(newValue);
    onChange(workLog)
  };

  private onSubmit = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      const {onSave, workLog} = this.props;
      if (workLog.valid) {
        onSave(workLog);
      }
    }
  };

  private onSelected = (event) => event.preventDefault();

  private handleSuggestionsFetchRequested = ({value}) => this.setState({
    suggestions: this.getSuggestions(value)
  });

  private handleSuggestionsClearRequested = () => this.setState({
    suggestions: []
  });

  private shouldRenderSuggestions = (text: string) => {
    const lastWord = WorkLogInput.getLastWord(text);
    return lastWord ? lastWord.startsWith('#') : false;
  };

  private getSuggestions = (text: string) => {
    const {tags} = this.props;
    const lastWord = WorkLogInput.getLastWord(text);
    if (isEmpty(lastWord)) {
      return [];
    }
    return chain(tags)
        .filter(tag => startsWith(tag.toLowerCase(), lastWord.replace('#', '')))
        .take(5)
        .sort()
        .map(tag => tag.trim())
        .map(tag => ({
          label: tag,
          value: text.replace(new RegExp(`${lastWord}$`), `#${tag} `)
        }))
        .value();
  };

  private static getLastWord(text: string) {
    return text.trim().split(/[\s,]+/).pop();
  }

  private handleCloseHelp = () => this.setState({helpOpen: false});

  private handleOpenHelp = () => this.setState({helpOpen: true});
}
