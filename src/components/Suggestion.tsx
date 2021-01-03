import { MenuItem } from '@material-ui/core';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

export interface SuggestionItem {
  label: string;
  value: string;
}

interface SuggestionProps {
  isHighlighted: boolean;
  query: string;
  suggestion: SuggestionItem;
}

export const Suggestion = ({isHighlighted, suggestion, query}: SuggestionProps) => {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);
  return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map((part, index) =>
              part.highlight ? (<span key={String(index)} style={{fontWeight: 500}}>{part.text}</span>) :
                  (<strong key={String(index)} style={{fontWeight: 300}}>{part.text}</strong>)
          )}
        </div>
      </MenuItem>
  );
};
