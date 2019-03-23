import { startsWith, chain } from 'lodash';
import { TimeProvider } from '../../../utils/dateTimeUtils';
import { SuggestionItem } from './Suggestion';
import { WorkLogExpressionParser } from '../../../workLogExpressionParser/WorkLogExpressionParser';

export class DatesSuggestionFactory {
  private static POSSIBLE_SUGGESTIONS = [
    'today',
    'yesterday',
    'tomorrow',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
    't-1',
    't-2',
    't-3'
  ];
  private workLogExpressionParser;

  constructor(timeProvider: TimeProvider = new TimeProvider()) {
    this.workLogExpressionParser = new WorkLogExpressionParser(timeProvider)
  }

  suggestions(text: string, prefix: string): SuggestionItem[] {
    const rawPrefix = prefix.replace('@', '');

    return chain(DatesSuggestionFactory.POSSIBLE_SUGGESTIONS)
        .map(suggestion => ({
          label: suggestion,
          day: this.mapSuggestionToDay(suggestion)
        }))
        .filter(suggestion => startsWith(suggestion.label, rawPrefix) || startsWith(suggestion.day, rawPrefix))
        .take(5)
        .map(suggestion => ({
          label: suggestion.label,
          value: text.replace(new RegExp(`${prefix}$`), `@${suggestion.label} `)
        }))
        .value();
  }

  private mapSuggestionToDay(suggestion: string) {
    return this.workLogExpressionParser
        .parse('1d #proj @' + suggestion)
        .day;
  }
}
