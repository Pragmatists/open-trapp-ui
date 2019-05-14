import { isEmpty, size } from 'lodash';

export class ParsedWorkLog {
  static readonly DATE_RANGE_PATTERN = /@[A-Z0-9/a-z-+]+~@[A-Z0-9/a-z-+]+/g;
  static readonly DATE_PATTERN = /@[A-Z0-9/a-z-+]+/g;

  constructor(
      readonly expression: string,
      readonly days: string[],
      readonly tags: string[],
      readonly workload: string
  ) {
  }

  get valid(): boolean {
    return !isEmpty(this.tags) && !isEmpty(this.workload);
  }

  static empty(): ParsedWorkLog {
    return new ParsedWorkLog('', [], [], undefined);
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
