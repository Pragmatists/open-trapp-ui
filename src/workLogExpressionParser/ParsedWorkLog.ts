import { isEmpty, size } from 'lodash';

export class ParsedWorkLog {
  static readonly DATE_RANGE_PATTERN = /@[A-Z0-9/a-z-+]+~@[A-Z0-9/a-z-+]+/g;
  static readonly DATE_PATTERN = /@[A-Z0-9/a-z-+]+/g;
  static readonly PROJECTS_TAG = "projects";

  constructor(
      readonly expression: string,
      readonly days: string[],
      readonly tags: string[],
      readonly workload: string
  ) {
  }

  public validate(): ValidationResult {
    const errors = [];
    if (!this.tags.includes("internal") && !this.tags.includes(ParsedWorkLog.PROJECTS_TAG)) {
      errors.push('tags must include either #internal or #projects');
    }
    if (this.tags.includes("internal") && this.tags.includes(ParsedWorkLog.PROJECTS_TAG)) {
      errors.push('#internal and #projects tags cannot be used together');
    }
    if (isEmpty(this.workload)) {
      errors.push('workload was not provided');
    }

    return {valid: errors.length === 0, errors}
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