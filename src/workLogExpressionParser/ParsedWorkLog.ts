import { isEmpty, size, union } from 'lodash';
import * as tagsConfig from '../tagsConfig.json';

export class ParsedWorkLog {
  static readonly DATE_RANGE_PATTERN = /@[A-Z0-9/a-z-+]+~@[A-Z0-9/a-z-+]+/g;
  static readonly DATE_PATTERN = /@[A-Z0-9/a-z-+]+/g;
  static readonly EXACTLY_ONE_TOP_LEVEL_TAG_ALLOWED_MSG = `exactly one of the following tags required: ${tagsConfig.topLevel.map(s => '#' + s).join(", ")}`;

  constructor(
      readonly expression: string,
      readonly days: string[],
      readonly tags: string[],
      readonly workload: string
  ) {
  }

  public validate(): ValidationResult {
    const errors = [];

    if (this.tags.filter(e => tagsConfig.topLevel.includes(e)).length !== 1) {
      errors.push(ParsedWorkLog.EXACTLY_ONE_TOP_LEVEL_TAG_ALLOWED_MSG)
    }
    if (this.tags.filter(e => tagsConfig.requireAdditionalTag.includes(e)).length != 0 && this.tags.length < 2) {
      errors.push('missing specific project tag: #projects #your-project-name');
    }

    if (isEmpty(this.workload)) {
      errors.push('workload was not provided');
    }

    return {valid: errors.length === 0, errors}
  }

  public withAddedTags(addedTags: string[]) {
    return new ParsedWorkLog(this.expression, this.days, union(this.tags, addedTags), this.workload);
  }

  static empty(): ParsedWorkLog {
    return new ParsedWorkLog('', [], [], undefined);
  }

  static from(tags: string[], day: string, workload: string) {
    const joinedTags = tags.map(t => `#${t}`).join(', ');
    const dayString = day ? '' : `@${day}`;
    return new ParsedWorkLog(`${workload} ${joinedTags} ${dayString}`, [day], tags, workload);
  }

  withDays(days: string[]): ParsedWorkLog {
    const daysExpression = ParsedWorkLog.daysToExpression(days);
    const newExpression = this.newExpression(daysExpression);
    return new ParsedWorkLog(newExpression, days, this.tags, this.workload);
  }

  private static daysToExpression(days: string[]): string {
    if (size(days) === 0) {
      return '';
    } else if (size(days) === 1) {
      return `@${days[0]}`;
    } else {
      return `@${days[0]}~@${days[days.length - 1]}`;
    }
  }

  private newExpression(newDaysExpression: string): string {
    if (ParsedWorkLog.DATE_RANGE_PATTERN.test(this.expression)) {
      return this.expression.replace(ParsedWorkLog.DATE_RANGE_PATTERN, newDaysExpression);
    } else if (ParsedWorkLog.DATE_PATTERN.test(this.expression)) {
      return this.expression.replace(ParsedWorkLog.DATE_PATTERN, newDaysExpression);
    } else  if (!isEmpty(this.expression)) {
      return this.expression + ' ' + newDaysExpression;
    }
    return newDaysExpression;
  }
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}