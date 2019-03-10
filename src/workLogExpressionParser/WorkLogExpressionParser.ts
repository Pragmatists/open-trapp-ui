import moment from 'moment';
import { extendMoment } from 'moment-range';
import { parse } from './WorkLogEntryGrammar';
import { trim, isEmpty } from 'lodash'
import { TimeProvider } from "../time/TimeProvider";

const momentRange = extendMoment(moment as any);

export class ParsedWorkLog {
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
}

export class WorkLogExpressionParser {
  private static readonly DATE_FORMAT = 'YYYY/MM/DD';
  private static readonly DATE_RANGE_PATTERN = /\@[A-Z0-9/a-z-]+\~\@[A-Z0-9/a-z-]+/g;

  constructor(private readonly timeProvider: TimeProvider = new TimeProvider()) {
  }

  parse(expression: string): ParsedWorkLog {
    try {
      if (this.hasDatesRange(expression)) {
        const {noDateExpression, datesRange} = this.datesFromRangeExpression(expression);
        const parsed = this.parseExpression(noDateExpression);
        return new ParsedWorkLog(expression, datesRange, parsed.tags, parsed.workload);
      } else {
        return this.parseExpression(expression);
      }
    } catch (e) {
      return new ParsedWorkLog(expression, [], [], undefined);
    }
  }

  isValid(expression: string): boolean {
    return this.parse(expression).valid;
  }

  private parseExpression(expression: string): ParsedWorkLog {
    const result = parse(trim(expression), {timeProvider: this.timeProvider});
    return new ParsedWorkLog(expression, [result.day], result.projectNames, result.workload);
  }

  private hasDatesRange(expression: string): boolean {
    return WorkLogExpressionParser.DATE_RANGE_PATTERN.test(expression);
  }

  private datesFromRangeExpression(expression: string): { noDateExpression: string; datesRange: string[]; } {
    const fromDateSelector = /\@[A-Z0-9/a-z-]+\~/g;
    const toDateSelector = /\~\@[A-Z0-9/a-z-]+/g;
    const fromDateMatch = expression.match(fromDateSelector);
    const toDateMatch = expression.match(toDateSelector);
    const fromDate = fromDateMatch[0].substring(0, fromDateMatch[0].length - 1);
    const toDate = toDateMatch[0].substring(1);

    return {
      noDateExpression: expression.replace(WorkLogExpressionParser.DATE_RANGE_PATTERN, ''),
      datesRange: this.datesArray(fromDate, toDate)
    };
  }

  private datesArray(from: string, to: string): string[] {
    const fromData = parse('1h #projects ' + from, {timeProvider: this.timeProvider});
    const toData = parse('1h #projects ' + to, {timeProvider: this.timeProvider});

    let start = moment(fromData.day, WorkLogExpressionParser.DATE_FORMAT);
    let end = moment(toData.day, WorkLogExpressionParser.DATE_FORMAT);

    if (end.isBefore(start)) {
      const pom = start;
      start = end;
      end = pom;
    }
    const range = momentRange.range(start, end);
    return Array.from(range.by('days'))
        .map(d => d.format(WorkLogExpressionParser.DATE_FORMAT));
  }
}
