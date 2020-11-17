import React, { useState } from 'react';
import { Paper } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import './WorkLogInput.scss'
import { WorkLogHelpDialog } from "../workLogHelpDialog/WorkLogHelpDialog";
import { WorkLogExpressionParser } from '../../../workLogExpressionParser/WorkLogExpressionParser';
import Autosuggest from 'react-autosuggest';
import { Suggestion } from '../../Suggestion';
import { difference, flatMap, isEmpty, noop } from 'lodash';
import { TagsSuggestionFactory } from './TagsSuggestionFactory';
import { DatesSuggestionFactory } from './DatesSuggestionFactory';
import { ConfirmNewTagsDialog } from '../confirmNewTagsDialog/ConfirmNewTagsDialog';
import { ParsedWorkLog } from '../../../workLogExpressionParser/ParsedWorkLog';
import { ValidationStatus } from './ValidationStatus';
import { Preset } from '../registration.model';

export interface WorkLogInputProps {
  workLog: ParsedWorkLog;
  tags: string[];
  presets: Preset[];
  onChange: (workLog: ParsedWorkLog) => void;
  onSave: (workLog: ParsedWorkLog) => void;
  autoAddedTagsMapping: Map<string, string[]>;
}

const renderInputComponent = inputProps => {
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

const renderSuggestion = (suggestion, {query, isHighlighted}) => (
    <Suggestion isHighlighted={isHighlighted} suggestion={suggestion} query={query}/>
);

const workLogExpressionParser = new WorkLogExpressionParser();

export const WorkLogInput = ({workLog, onChange, autoAddedTagsMapping, tags, presets, onSave}: WorkLogInputProps) => {
  const [helpOpen, setHelpOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([]);
  const [newTags, setNewTags] = useState([]);

  const handleInputChange = (event, {newValue}) => {
    const workLog = workLogExpressionParser.parse(newValue);
    const tagsWithAutoAddMapping = workLog.tags.filter(tag => autoAddedTagsMapping.has(tag));
    const autoAddedTags = flatMap(tagsWithAutoAddMapping, tag => autoAddedTagsMapping.get(tag));
    onChange(workLog.withAddedTags(autoAddedTags));
  };

  const handleSubmit = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (workLog.validate().valid) {
        const newTags = difference(workLog.tags, tags);
        if (isEmpty(newTags)) {
          onSave(workLog);
        } else {
          setNewTags(newTags);
        }
      }
    }
  };

  const getLastWord = (text: string) => text.trim()
      .split(/[\s,]+/)
      .pop();

  const shouldRenderSuggestions = (text: string) => {
    const lastWord = getLastWord(text);
    return lastWord ? lastWord.startsWith('#') || lastWord.startsWith('@') : false;
  };

  const getSuggestions = (text: string) => {
    const lastWord = getLastWord(text);
    if (isEmpty(lastWord)) {
      return [];
    } else if (lastWord.startsWith('#')) {
      return new TagsSuggestionFactory(tags, presets).suggestions(text, lastWord);
    } else if (lastWord.startsWith('@')) {
      return new DatesSuggestionFactory().suggestions(text, lastWord);
    }
    return [];
  };

  const handleConfirmationDialogClose = (workLog: ParsedWorkLog, result: boolean) => {
    if (result) {
      onSave(workLog);
    }
    setNewTags([]);
  };

  return (
      <Paper className='work-log-input' elevation={1}>
        <Autosuggest
            renderInputComponent={renderInputComponent}
            getSuggestionValue={s => s.value}
            inputProps={{
              className: 'work-log-input__input',
              placeholder: '1d #my-project',
              value: workLog.expression,
              autoFocus: true,
              onChange: handleInputChange,
              onKeyPress: handleSubmit
            }}
            onSuggestionsFetchRequested={({value}) => setSuggestions(getSuggestions(value))}
            onSuggestionsClearRequested={() => setSuggestions([])}
            onSuggestionSelected={e => e.preventDefault()}
            shouldRenderSuggestions={shouldRenderSuggestions}
            renderSuggestion={renderSuggestion}
            suggestions={suggestions}
            renderSuggestionsContainer={options => (
                <Paper {...options.containerProps}>
                  {options.children}
                </Paper>
            )}
        />
        <ValidationStatus workLog={workLog}/>
        <IconButton aria-label='Help' onClick={() => setHelpOpen(true)}>
          <HelpIcon color='primary'/>
        </IconButton>
        <WorkLogHelpDialog open={helpOpen} onClose={() => setHelpOpen(false)}/>
        <ConfirmNewTagsDialog workLog={workLog}
                              newTags={newTags}
                              onClose={handleConfirmationDialogClose}
                              open={!isEmpty(newTags)}/>
      </Paper>
  );
}
