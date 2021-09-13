import { isEmpty, size, union, toInteger } from 'lodash';
import * as tagsConfig from '../tagsConfig.json';

export class ParsedWorkLog {
  static readonly WORKLOAD_PATTERN = /(?:([0-9]+)d)?\s?(?:([0-9]+)h)?\s?(?:([0-9]+)m)?/;
  static readonly DATE_RANGE_PATTERN = /@[A-Z0-9/a-z-+]+~@[A-Z0-9/a-z-+]+/g;
  static readonly DATE_PATTERN = /@[A-Z0-9/a-z-+]+/g;
  static readonly EXACTLY_ONE_TOP_LEVEL_TAG_ALLOWED_MSG = `Exactly one of the following tags required: ${tagsConfig.topLevel.map(s => '#' + s).join(", ")}`;

  constructor(
      readonly expression: string,
      readonly days: string[],
      readonly tags: string[],
      readonly workload: string,
      readonly note?: string
  ) {
  }

  public validate(): ValidationResult {
    const errors = [];
    if (this.tags.filter(e => tagsConfig.topLevel.includes(e)).length !== 1) {
      errors.push(ParsedWorkLog.EXACTLY_ONE_TOP_LEVEL_TAG_ALLOWED_MSG)
    }
    if (this.tags.filter(e => tagsConfig.requireAdditionalTag.includes(e)).length > 0 && this.tags.length < 2) {
      errors.push('Missing specific project tag: #projects #your-project-name');
    }
    if (isEmpty(this.workload)) {
      errors.push('Workload was not provided');
    }
    if (ParsedWorkLog.workloadExceeds24Hours(this.workload)) {
      errors.push("Workload can't exceed 24 hours");
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

  withNote(note: string): ParsedWorkLog {
    return new ParsedWorkLog(this.expression, this.days, this.tags, this.workload, note)
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

  private static workloadExceeds24Hours(expression: string): boolean {
    const matches = ParsedWorkLog.WORKLOAD_PATTERN.exec(expression);
    const days = ParsedWorkLog.parseGroup(matches[1]);
    const hours = ParsedWorkLog.parseGroup(matches[2]);
    const minutes = ParsedWorkLog.parseGroup(matches[3]);
    const workload = days * 8 * 60 + hours * 60 + minutes;
    return workload > 24 * 60;
  }

  private static parseGroup(group: string): number {
    return group ? toInteger(group) : 0;
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
