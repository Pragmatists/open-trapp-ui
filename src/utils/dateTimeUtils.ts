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
