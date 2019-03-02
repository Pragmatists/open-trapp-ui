import moment from 'moment';
import { parse } from './WorkLogEntryGrammar';
import { isNil, trim } from 'lodash'
import { TimeProvider } from "../time/TimeProvider";

interface WorkLog {
  days: string[];
  tags: string[];
  workload: string;
}

export class WorkLogExpressionParser {
  private static readonly DATE_RANGE_PATTERN = /\@[A-Z0-9/a-z-]+\~\@[A-Z0-9/a-z-]+/g;
  private static readonly DATE_PATTERN = /\@[A-Z0-9/a-z-]+/g;

  constructor(private readonly timeProvider: TimeProvider = new TimeProvider()) {
  }

  parse(expression: string): WorkLog | null {
    try {
      const result = parse(trim(expression), {timeProvider: this.timeProvider});
      return {
        tags: result.projectNames,
        days: [result.day],
        workload: result.workload
      };
    } catch (e) {
      return null;
    }
  }

  isValid(expression: string): boolean {
    return !isNil(this.parse(expression));
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

    const result = [];
    for (let day = start; day <= end; day = day.add(1, 'd')) {
      if (day.days() > 0 && day.days() < 6)
        result.push(day.format("YYYY/MM/DD"));
    }
    return result;
  }
}
