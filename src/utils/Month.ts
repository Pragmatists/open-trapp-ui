import moment from 'moment';

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

  isBefore(other: Month): boolean {
    return this.year < other.year || (this.year === other.year && this.month < other.month);
  }

  toString(): string {
    return moment([this.year, this.month - 1, 1]).format('YYYY/MM')
  }

  static get current(): Month {
    const today = moment();
    return new Month(today.year(), today.month() + 1);
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
