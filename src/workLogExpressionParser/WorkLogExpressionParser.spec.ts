import { TimeProvider } from '../utils/dateTimeUtils';
import { WorkLogExpressionParser } from './WorkLogExpressionParser';

describe('WorkLogExpressionParser', () => {
  const CURRENT_DATE = "2014/01/02";
  const CURRENT_WEEKDAY = 'thursday';
  const YESTERDAY = '2014/01/01';
  const TOMORROW = '2014/01/03';
  const MONDAY_BEFORE_TODAY = '2013/12/30';
  const FRIDAY_BEFORE_TODAY = '2013/12/27';
  const MONDAY_AFTER_TODAY = '2014/01/06';
  const WEEK_BEFORE_TODAY = '2013/12/26';
  const WEEK_AFTER_TODAY = '2014/01/09';
  const SOME_WORKLOAD = '1d 1h 1m';
  const SOME_PROJECT = 'ProjectManhattan';
  const SOME_DATE = '2013/02/01';
  let workLogExpressionParser: WorkLogExpressionParser;
  let timeProvider;

  beforeEach(() => {
    timeProvider = new TimeProvider();
    spyOn(timeProvider, 'getCurrentDate').and.returnValue(new Date(CURRENT_DATE));
    workLogExpressionParser = new WorkLogExpressionParser(timeProvider);
  });

  it('parses full worklog', () => {
    const workLogExpression = '2h #ProjectManhattan @2014/01/03';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression)).toEqual({
      expression: '2h #ProjectManhattan @2014/01/03',
      tags: ['ProjectManhattan'],
      workload: '2h',
      days: ['2014/01/03']
    });
  });

  it('parses work log for current day', () => {
    const workLogExpression = '2h #ProjectManhattan';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([CURRENT_DATE]);
  });

  it('parses work log for monday', () => {
    const workLogExpression = '2h #ProjectManhattan @monday';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([MONDAY_BEFORE_TODAY]);
  });

  it('parses work log for weekday with upper letter', () => {
    const workLogExpression = '2h #ProjectManhattan @Monday';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([MONDAY_BEFORE_TODAY]);
  });

  it('parses work log for friday', () => {
    const workLogExpression = '2h #ProjectManhattan @friday';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([FRIDAY_BEFORE_TODAY]);
  });

  it('parses work log for last monday', () => {
    const workLogExpression = '2h #ProjectManhattan @last-monday';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([MONDAY_BEFORE_TODAY]);
  });

  it('parses work log for next monday', () => {
    const workLogExpression = '2h #ProjectManhattan @next-monday';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([MONDAY_AFTER_TODAY]);
  });

  it('parses work log for weekday exactly week before today', () => {
    const workLogExpression = '2h #ProjectManhattan @last-thursday';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([WEEK_BEFORE_TODAY]);
  });

  it('parses work log for weekday exactly week after today', () => {
    const workLogExpression = '2h #ProjectManhattan @next-thursday';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([WEEK_AFTER_TODAY]);
  });

  it('parses work log for yesterday', () => {
    const workLogExpression = '2h #ProjectManhattan @yesterday';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([YESTERDAY]);
  });

  it('parses work log for today', () => {
    const workLogExpression = '2h #ProjectManhattan @today';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([CURRENT_DATE]);
  });

  it('parses work log for today if given weekday', () => {
    const workLogExpression = '2h #ProjectManhattan @' + CURRENT_WEEKDAY;

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([CURRENT_DATE]);
  });

  it('parses work log for tomorrow', () => {
    const workLogExpression = '2h #ProjectManhattan @tomorrow';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([TOMORROW]);
  });

  it('parses work log for yesterday by t-1', () => {
    const workLogExpression = '2h #ProjectManhattan @t-1';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([YESTERDAY]);
  });

  it('parses work log for tomorrow by t+1', () => {
    const workLogExpression = '2h #ProjectManhattan @t+1';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([TOMORROW]);
  });

  it('parses work log with days and hours', () => {
    const workLogExpression = '1d 3h #ProjectManhattan';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual("1d 3h");
  });

  it('parses work log with days and hours', () => {
    const workLogExpression = '1d 5h 15m #ProjectManhattan';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual("1d 5h 15m");
  });

  it('parses work log for 1d by default', () => {
    const workLogExpression = '#ProjectManhattan';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual("1d");
  });

  it('does not parse work log for invalid date', () => {
    const workLogExpression = '#ProjectManhattan @invalid';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
  });

  it('does not parse work log for invalid text', () => {
    const workLogExpression = 'invalid';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
  });

  it('does not parse work log for fractions', () => {
    const workLogExpression = '1,5h #ProjectMangattan';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
  });

  it('does not parse empty project', () => {
    const workLogExpression = '#';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
  });

  it('does not parse workload at the end of project name', () => {
    const workLogExpression = '#project2d';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual("1d");
    expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual(["project2d"]);
  });

  it('parses work log with hyphen in project for today', () => {
    const workLogExpression = '2h #Project-Manhattan';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual(["Project-Manhattan"]);
  });

  it('does not parse work log with double day info', () => {
    const workLogExpression = '#Project-Manhattan @monday @tuesday';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
    const parsed = workLogExpressionParser.parse(workLogExpression);
    expect(parsed.valid).toBeFalsy();
  });

  it('does not parse work log with double workload hours info', () => {
    const workLogExpression = '2h 3h #Project-Manhattan';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
    const parsed = workLogExpressionParser.parse(workLogExpression);
    expect(parsed.valid).toBeFalsy();
  });

  it('does not parse work log with double workload days info', () => {
    const workLogExpression = '1d 1d #Project-Manhattan';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
    const parsed = workLogExpressionParser.parse(workLogExpression);
    expect(parsed.valid).toBeFalsy();
  });

  it('does not parse work log with double workload minutes info', () => {
    const workLogExpression = '30m 45m #Project-Manhattan';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
    const parsed = workLogExpressionParser.parse(workLogExpression);
    expect(parsed.valid).toBeFalsy();
  });

  it('does not parse entry with invalid number', () => {
    const workLogExpression = '1h #Project-Manhattan 2h 3h @t-123456789';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
    const parsed = workLogExpressionParser.parse(workLogExpression);
    expect(parsed.valid).toBeFalsy();
  });

  it('does not parse entry with negative workload', () => {
    const workLogExpression = '-10h #Project-Manhattan';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
    const parsed = workLogExpressionParser.parse(workLogExpression);
    expect(parsed.valid).toBeFalsy();
    expect(parsed).toEqual({
      expression: '-10h #Project-Manhattan',
      days: [],
      tags: [],
      workload: undefined
    });
  });

  it('parses entry for date without trailing zeros', () => {
    const workLogExpression = '4h 30m #Project-Manhattan @2014/1/1';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([YESTERDAY]);
  });

  it('parses work log padded with spaces', () => {
    const workLogExpression = '  2h #ProjectManhattan @2014/01/03   ';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();

    const parsed = workLogExpressionParser.parse(workLogExpression);
    expect(parsed.valid).toBeTruthy();
    expect(parsed).toEqual({
      expression: '  2h #ProjectManhattan @2014/01/03   ',
      tags: ['ProjectManhattan'],
      workload: '2h',
      days: ['2014/01/03']
    });
  });

  it('parses multiple projects', () => {
    const workLogExpression = '4h #ProjectManhattan #Apollo @today';

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual([
      'ProjectManhattan', 'Apollo'
    ]);
  });

  it('parses work log in order: workload, date, project', () => {
    const workLogExpression = new Expression()
        .withWorkload(SOME_WORKLOAD)
        .withDate(SOME_DATE)
        .withProject(SOME_PROJECT)
        .build();

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual([SOME_PROJECT]);
    expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual(SOME_WORKLOAD);
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([SOME_DATE]);
  });

  it('parses work log in order: date, workload, project', () => {
    const workLogExpression = new Expression()
        .withDate(SOME_DATE)
        .withWorkload(SOME_WORKLOAD)
        .withProject(SOME_PROJECT)
        .build();

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual([SOME_PROJECT]);
    expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual(SOME_WORKLOAD);
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([SOME_DATE]);
  });

  it('parses work log in order: date, project, workload', () => {
    const workLogExpression = new Expression()
        .withDate(SOME_DATE)
        .withProject(SOME_PROJECT)
        .withWorkload(SOME_WORKLOAD)
        .build();

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual([SOME_PROJECT]);
    expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual(SOME_WORKLOAD);
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([SOME_DATE]);
  });

  it('parses work log in order: project, workload, date', () => {
    const workLogExpression = new Expression()
        .withProject(SOME_PROJECT)
        .withWorkload(SOME_WORKLOAD)
        .withDate(SOME_DATE)
        .build();

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual([SOME_PROJECT]);
    expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual(SOME_WORKLOAD);
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([SOME_DATE]);
  });

  it('parses work log in order: project, date, workload', () => {
    const workLogExpression = new Expression()
        .withProject(SOME_PROJECT)
        .withDate(SOME_DATE)
        .withWorkload(SOME_WORKLOAD)
        .build();

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual([SOME_PROJECT]);
    expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual(SOME_WORKLOAD);
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([SOME_DATE]);
  });

  it('parses work log in order: date, project', () => {
    const workLogExpression = new Expression()
        .withDate(SOME_DATE)
        .withProject(SOME_PROJECT)
        .build();

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual([SOME_PROJECT]);
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([SOME_DATE]);
  });

  it('parses work log in order: project, workload', () => {
    const workLogExpression = new Expression()
        .withProject(SOME_PROJECT)
        .withWorkload(SOME_WORKLOAD)
        .build();

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual([SOME_PROJECT]);
    expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual(SOME_WORKLOAD);
  });

  it('parses work log with dates range', () => {
    const workLogExpression = new Expression()
        .withProject(SOME_PROJECT)
        .withWorkload(SOME_WORKLOAD)
        .withDateRange('2019/03/01', '2019/03/03')
        .build();

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual(['2019/03/01', '2019/03/02', '2019/03/03']);
  });

  it('parses work log with named dates range', () => {
    const workLogExpression = new Expression()
        .withProject(SOME_PROJECT)
        .withWorkload(SOME_WORKLOAD)
        .withDateRange('today', 't+1')
        .build();

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([CURRENT_DATE, TOMORROW]);
  });

  it('parses work log with inverted range', () => {
    const workLogExpression = new Expression()
        .withProject(SOME_PROJECT)
        .withWorkload(SOME_WORKLOAD)
        .withDateRange('tomorrow', 'today')
        .build();

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([CURRENT_DATE, TOMORROW]);
  });

  it('parses work log with range of single day', () => {
    const workLogExpression = new Expression()
        .withProject(SOME_PROJECT)
        .withWorkload(SOME_WORKLOAD)
        .withDateRange('today', 'today')
        .build();

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([CURRENT_DATE]);
  });

  it('parses day even if expression is invalid (missing tag)', () => {
    const workLogExpression = new Expression()
        .withWorkload(SOME_WORKLOAD)
        .withDate('@2019/03/01')
        .build();

    expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
    expect(workLogExpressionParser.parse(workLogExpression).days).toEqual(['2019/03/01'])
  });

  class Expression {
    private expression = '';

    withWorkload(workload: string): Expression {
      this.addSpaceIfNeeded();
      this.expression += workload;
      return this;
    };

    withProject(project: string): Expression {
      this.addSpaceIfNeeded();
      this.expression += `#${project}`;
      return this;
    };

    withDate(date: string): Expression {
      this.addSpaceIfNeeded();
      this.expression += `@${date}`;
      return this;
    };

    withDateRange(startDate: string, endDate: string): Expression {
      this.addSpaceIfNeeded();
      this.expression += `@${startDate}~@${endDate}`;
      return this;
    }

    build(): string {
      return this.expression;
    };

    private addSpaceIfNeeded() {
      if (this.expression.length > 0) {
        this.expression += ' ';
      }
    }
  }
});
