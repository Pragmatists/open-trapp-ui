import { SuggestionItem } from '../../Suggestion';

export class TagsSuggestionFactory {
  constructor(private tags: string[]) {}

  suggestions(text: string, prefix: string): SuggestionItem[] {
    const trimmedPrefix = prefix.replace('#', '');
    return this.tags
        .filter(tag => tag.toLowerCase().startsWith(trimmedPrefix))
        .slice(0, 5)
        .map(tag => tag.trim())
        .sort()
        .map(tag => ({
          label: tag,
          value: text.replace(new RegExp(`${prefix}$`), `#${tag} `)
        }));
  }
}
