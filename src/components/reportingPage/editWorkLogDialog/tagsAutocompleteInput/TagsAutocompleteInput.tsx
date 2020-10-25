import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autosuggest from 'react-autosuggest';
import { Suggestion, SuggestionItem } from '../../../Suggestion';
import { Paper } from '@material-ui/core';
import { last, startsWith } from 'lodash';
import './TagsAutocompleteInput.scss';

interface TagsAutocompleteInputProps {
  label?: string;
  value: string;
  className?: string;
  tags: string[];
  onChange: (value: string) => void;
}

const renderSuggestion = (suggestion: SuggestionItem, {query, isHighlighted}) => (
    <Suggestion isHighlighted={isHighlighted} query={query} suggestion={suggestion}/>
);

const renderInputComponent = (inputProps) => {
  const {classes, inputRef = () => {}, ref, ...other} = inputProps;
  return (
      <TextField fullWidth
                 InputProps={{
                   inputRef: node => {
                     ref(node);
                     inputRef(node);
                   }
                 }}
                 {...other}
                 data-testid='edit-project'/>
  );
};

export const TagsAutocompleteInput = ({value, tags, label = 'Projects', className = 'text-field', onChange}: TagsAutocompleteInputProps) => {
  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = (text: string) => {
    const prefix = last(text.split(',').map(t => t.trim()));
    return tags
        .filter(tag => startsWith(tag.toLowerCase(), prefix))
        .slice(0, 5)
        .map(tag => tag.trim())
        .sort()
        .map(tag => ({
          label: tag,
          value: text.replace(new RegExp(`${prefix}$`), `${tag}, `)
        }));
  };

  return (
      <div className='tags-autocomplete'>
        <Autosuggest renderInputComponent={renderInputComponent}
                     getSuggestionValue={v => v.value}
                     inputProps={{
                       className,
                       value,
                       label,
                       onChange: (event, {newValue}) => onChange(newValue)
                     } as any}
                     onSuggestionsFetchRequested={({value}) => setSuggestions(getSuggestions(value))}
                     onSuggestionsClearRequested={() => setSuggestions([])}
                     renderSuggestion={renderSuggestion}
                     renderSuggestionsContainer={options => (
                         <Paper {...options.containerProps}>
                           {options.children}
                         </Paper>
                     )}
                     suggestions={suggestions}/>
      </div>
  );
}
