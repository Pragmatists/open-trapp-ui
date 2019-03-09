import moment from 'moment';
import { parse } from './WorkLogEntryGrammar';
import { isNil, trim, isEmpty } from 'lodash'
import { TimeProvider } from "../time/TimeProvider";

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
  private static readonly DATE_RANGE_PATTERN = /\@[A-Z0-9/a-z-]+\~\@[A-Z0-9/a-z-]+/g;
  private static readonly DATE_PATTERN = /\@[A-Z0-9/a-z-]+/g;

  constructor(private readonly timeProvider: TimeProvider = new TimeProvider()) {
  }

  parse(expression: string): ParsedWorkLog {
    try {
      const result = parse(trim(expression), {timeProvider: this.timeProvider});
      return new ParsedWorkLog(expression, [result.day], result.projectNames, result.workload);
    } catch (e) {
      return new ParsedWorkLog(expression, [], [], undefined);
    }
  }

  isValid(expression: string): boolean {
    return this.parse(expression).valid;
  }

  private getDatesArray(from: string, to: string): string[] {

    const fromData = parse('1h #projects ' + from, {timeProvider: this.timeProvider});
    const toData = parse('1h #projects ' + to, {timeProvider: this.timeProvider});

    let start: moment.Moment = moment(fromData.day, "YYYY/MM/DD");
    let end: moment.Moment = moment(toData.day, "YYYY/MM/DD");

    if (end.isBefore(start)) {
      const pom = start;
      start = end;
      end = pom;
    }

    if (from === to) {
      return [start.format("YYYY/MM/DD")];
    }

    const result: string[] = [];
    for (let day = start; day <= end; day = day.add(1, 'd')) {
      if (day.days() > 0 && day.days() < 6)
        result.push(day.format("YYYY/MM/DD"));
    }
    return result;
  }
}
