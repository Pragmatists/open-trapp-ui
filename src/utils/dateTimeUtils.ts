import moment from 'moment';
import { extendMoment } from 'moment-range';

const momentRange = extendMoment(moment as any);

export function daysInRange(startDate: string, endDate: string, format = 'YYYY/MM/DD'): string[] {
  let start = moment(startDate, format);
  let end = moment(endDate, format);

  if (end.isBefore(start)) {
    const pom = start;
    start = end;
    end = pom;
  }
  const range = momentRange.range(start, end);
  return Array.from(range.by('days'))
      .map(d => d.format(format));
}

export class TimeProvider {
  getCurrentDate() {
    return new Date();
  }
}

export class Month {
  constructor(readonly year: number, readonly month: number) {
  }

  get next(): Month {
    if (this.month === 12) {
      return new Month(this.year + 1, 1);
    }
    return new Month(this.year, this.month + 1);
  }

  get previous(): Month {
    if (this.month === 1) {
      return new Month(this.year - 1, 12);
    }
    return new Month(this.year, this.month - 1);
  }

  range(numberOfPrevious: number, numberOfNext: number): Month[] {
    return [...Month.previousMonths(this, numberOfPrevious), this, ...Month.nextMonths(this, numberOfNext)]
  }

  minus(numberOfMonths: number): Month {
    if (numberOfMonths === 0) {
      return this;
    }
    return this.previous.minus(numberOfMonths - 1);
  }

  plus(numberOfMonths: number): Month {
    if (numberOfMonths === 0) {
      return this;
    }
    return this.next.plus(numberOfMonths - 1);
  }

  toString(): string {
    return moment([this.year, this.month - 1, 1]).format('YYYY/MM')
  }

  private static nextMonths(month: Month, numberOfNext: number): Month[] {
    if (numberOfNext === 0) {
      return [];
    }
    const next = month.next;
    return [next, ...Month.nextMonths(next, numberOfNext - 1)];
  }

  private static previousMonths(month: Month, numberOfPrevious: number): Month[] {
    if (numberOfPrevious === 0) {
      return [];
    }
    const previous = month.previous;
    return [...Month.previousMonths(previous, numberOfPrevious - 1), previous];
  }
}