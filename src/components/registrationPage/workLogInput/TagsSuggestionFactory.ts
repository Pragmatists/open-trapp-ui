import { SuggestionItem } from '../../Suggestion';
import { Preset } from '../registration.model';
import { some } from 'lodash';

export class TagsSuggestionFactory {
  private static SUGGESTIONS_LIMIT = 5;

  constructor(private readonly tags: string[], private readonly presets: Preset[]) {}

  suggestions(text: string, prefix: string): SuggestionItem[] {
    const presets = this.presetSuggestions(text, prefix);
    const tags = this.tagSuggestions(text, prefix, TagsSuggestionFactory.SUGGESTIONS_LIMIT - presets.length);
    return [...presets, ...tags];
  }

  private tagSuggestions(text: string, prefix: string, limit = TagsSuggestionFactory.SUGGESTIONS_LIMIT): SuggestionItem[] {
    const trimmedPrefix = this.trimPrefix(prefix);
    return this.tags
        .filter(tag => tag.toLowerCase().startsWith(trimmedPrefix))
        .slice(0, limit)
        .map(tag => tag.trim())
        .sort()
        .map(tag => ({
          label: tag,
          value: text.replace(new RegExp(`${prefix}$`), `#${tag} `)
        }));
  }

  private presetSuggestions(text: string, prefix: string): SuggestionItem[] {
    const trimmedPrefix = this.trimPrefix(prefix);
    return this.presets
        .filter(preset => some(preset.tags, tag => tag.toLowerCase().startsWith(trimmedPrefix)))
        .slice(0, TagsSuggestionFactory.SUGGESTIONS_LIMIT)
        .map(preset => ({
          label: preset.tags.join(', '),
          value: text.replace(new RegExp(`${prefix}$`), preset.tags.map(t => `#${t} `).join(''))
        }));
  }

  private trimPrefix(prefix: string) {
    return prefix.replace('#', '');
  }
}
