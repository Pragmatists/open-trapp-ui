import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Autosuggest from 'react-autosuggest';
import { Suggestion, SuggestionItem } from '../../../Suggestion';
import { Paper } from '@material-ui/core';
import { chain, startsWith, last } from 'lodash';
import './TagsAutocompleteInput.scss';

interface TagsAutocompleteInputProps {
  label?: string;
  value: string;
  className?: string;
  tags: string[];
  onChange: (value: string) => void;
}

interface TagsAutocompleteInputState {
  suggestions: SuggestionItem[];
}

export class TagsAutocompleteInput extends Component<TagsAutocompleteInputProps, TagsAutocompleteInputState> {
  state = {
    suggestions: []
  };

  render() {
    const {value, label = 'Projects', className = 'text-field', onChange} = this.props;
    return (
        <div className='tags-autocomplete'>
          <Autosuggest renderInputComponent={this.renderInputComponent}
                       getSuggestionValue={v => v.value}
                       inputProps={{
                         className,
                         value,
                         label,
                         onChange: (event, {newValue}) => onChange(newValue)
                       }}
                       onSuggestionsFetchRequested={this.handleSuggestionFetchRequest}
                       onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                       renderSuggestion={this.renderSuggestion}
                       renderSuggestionsContainer={options => (
                           <Paper {...options.containerProps}>
                             {options.children}
                           </Paper>
                       )}
                       suggestions={this.state.suggestions} />
        </div>

    );
  }

  private renderInputComponent = (inputProps) => {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps;
    return (
        <TextField fullWidth
                   InputProps={{
                     inputRef: node => {
                       ref(node);
                       inputRef(node);
                     },
                   }}
                   {...other}
                   data-edit-work-log-project/>
    );
  };

  private renderSuggestion = (suggestion: SuggestionItem, { query, isHighlighted }) => (
      <Suggestion isHighlighted={isHighlighted} query={query} suggestion={suggestion}/>
  );

  private handleSuggestionFetchRequest = ({ value }) => this.setState({
    suggestions: this.getSuggestions(value),
  });

  private handleSuggestionsClearRequested = () => this.setState({
    suggestions: [],
  });

  private getSuggestions = (text: string) => {
    const {tags} = this.props;
    const prefix = last(text.split(',').map(t => t.trim()));
    return chain(tags)
        .filter(tag => startsWith(tag.toLowerCase(), prefix))
        .take(5)
        .sort()
        .map(tag => tag.trim())
        .map(tag => ({
          label: tag,
          value: text.replace(new RegExp(`${prefix}$`), `${tag}, `)
        }))
        .value() as SuggestionItem[];
  };
}
