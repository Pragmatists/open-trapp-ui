import { parse } from './WorkLogEntryGrammar';
import { trim } from 'lodash'
import { TimeProvider } from "../time/TimeProvider";
import { daysInRange } from '../utils/dateTimeUtils';
import { ParsedWorkLog } from './ParsedWorkLog';

export class WorkLogExpressionParser {
  private static readonly DATE_FORMAT = 'YYYY/MM/DD';

  constructor(private readonly timeProvider: TimeProvider = new TimeProvider()) {
  }

  parse(expression: string): ParsedWorkLog {

    if (this.hasDatesRange(expression)) {
      const {noDateExpression, datesRange} = this.daysFromRangeExpression(expression);
      const parsed = this.parseExpression(noDateExpression);
      return new ParsedWorkLog(expression, datesRange, parsed.tags, parsed.workload);
    } else if (this.hasDate(expression)) {
      const day = this.dayFromExpression(expression);
      const parsed = this.parseExpression(expression);
      return new ParsedWorkLog(expression, [day], parsed.tags, parsed.workload);
    }
    return this.parseExpression(expression);
  }

  isValid(expression: string): boolean {
    return this.parse(expression).valid;
  }

  private parseExpression(expression: string): ParsedWorkLog {
    try {
      const result = parse(trim(expression), {timeProvider: this.timeProvider});
      return new ParsedWorkLog(expression, [result.day], result.projectNames, result.workload);
    } catch (e) {
      return new ParsedWorkLog(expression, [], [], undefined);
    }
  }

  private hasDatesRange(expression: string): boolean {
    return ParsedWorkLog.DATE_RANGE_PATTERN.test(expression);
  }

  private hasDate(expression: string): boolean {
    return ParsedWorkLog.DATE_PATTERN.test(expression);
  }

  private daysFromRangeExpression(expression: string): { noDateExpression: string; datesRange: string[]; } {
    const fromDateSelector = /\@[A-Z0-9/a-z-\+]+\~/g;
    const toDateSelector = /\~\@[A-Z0-9/a-z-\+]+/g;
    const fromDateMatch = expression.match(fromDateSelector);
    const toDateMatch = expression.match(toDateSelector);
    const fromDate = fromDateMatch[0].substring(0, fromDateMatch[0].length - 1);
    const toDate = toDateMatch[0].substring(1);

    return {
      noDateExpression: expression.replace(ParsedWorkLog.DATE_RANGE_PATTERN, ''),
      datesRange: this.datesArray(fromDate, toDate)
    };
  }

  private dayFromExpression(expression: string): string {
    const dateMatch = expression.match(ParsedWorkLog.DATE_PATTERN);
    const date = dateMatch[0];
    return this.parseExpression(`#tag ${date}`).days[0];
  }

  private datesArray(from: string, to: string): string[] {
    const fromData = parse('1h #projects ' + from, {timeProvider: this.timeProvider});
    const toData = parse('1h #projects ' + to, {timeProvider: this.timeProvider});
    return daysInRange(fromData.day, toData.day, WorkLogExpressionParser.DATE_FORMAT);
  }
}
