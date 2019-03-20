import { Month } from './Month';
import moment from 'moment';

describe('Month', () => {
  it('returns formatted string', () => {
    const month = new Month(2019, 3);

    expect(month.toString()).toEqual('2019/03');
  });

  it('provides current month', () => {
    const current = moment();

    expect(Month.current.year).toEqual(current.year());
    expect(Month.current.month).toEqual(current.month() + 1);
  });

  it('calculates next moth', () => {
    const month = new Month(2019, 3);

    const next = month.next;

    expect(next.year).toEqual(2019);
    expect(next.month).toEqual(4);
  });

  it('calculate previous month', () => {
    const month = new Month(2019, 3);

    const previous = month.previous;

    expect(previous.year).toEqual(2019);
    expect(previous.month).toEqual(2);
  });

  it('calculates months range', () => {
    const month = new Month(2019, 3);

    const range = month.range(3, 1)
        .map(m => m.toString());

    expect(range).toEqual(['2018/12', '2019/01', '2019/02', '2019/03', '2019/04']);
  });

  it('calculates month shifted back by the given number', () => {
    const month = new Month(2019, 2);

    const shifted = month.minus(2);

    expect(shifted.year).toEqual(2018);
    expect(shifted.month).toEqual(12);
  });

  it('calculates month shifted forward by the given number', () => {
    const month = new Month(2018, 11);

    const shifted = month.plus(15);

    expect(shifted.year).toEqual(2020);
    expect(shifted.month).toEqual(2);
  });

  [
    {month1: new Month(2019, 2), month2: new Month(2019, 3), isBefore: true},
    {month1: new Month(2018, 11), month2: new Month(2019, 1), isBefore: true},
    {month1: new Month(2019, 1), month2: new Month(2019, 1), isBefore: false},
    {month1: new Month(2019, 3), month2: new Month(2018, 11), isBefore: false},
    {month1: new Month(2019, 3), month2: new Month(2019, 1), isBefore: false}
  ].forEach(({month1, month2, isBefore}) =>
    it(`${month1.toString()} ${isBefore ? 'is before' : 'is not before'} ${month2}`, () => {
      expect(month1.isBefore(month2)).toEqual(isBefore);
    })
  );
});
