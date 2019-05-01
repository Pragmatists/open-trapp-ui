import { startsWith, chain } from 'lodash';
import { SuggestionItem } from '../../Suggestion';

export class TagsSuggestionFactory {
  constructor(private tags: string[]) {}

  suggestions(text: string, prefix: string): SuggestionItem[] {
    return chain(this.tags)
        .filter(tag => startsWith(tag.toLowerCase(), prefix.replace('#', '')))
        .take(5)
        .sort()
        .map(tag => tag.trim())
        .map(tag => ({
          label: tag,
          value: text.replace(new RegExp(`${prefix}$`), `#${tag} `)
        }))
        .value();
  }
}