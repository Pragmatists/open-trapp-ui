import {TimeProvider} from '../time/TimeProvider';
import {WorkLogExpressionParser} from './WorkLogExpressionParser';

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

    it('should parse full worklog', () => {
        const workLogExpression = '2h #ProjectManhattan @2014/01/03';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression)).toEqual({
            tags: ['ProjectManhattan'],
            workload: '2h',
            days: ['2014/01/03']
        });
    });

    it('should parse worklog for current day', () => {
        const workLogExpression = '2h #ProjectManhattan';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([CURRENT_DATE]);
    });

    it('should parse worklog for monday', () => {
        const workLogExpression = '2h #ProjectManhattan @monday';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([MONDAY_BEFORE_TODAY]);
    });

    it('should parse worklog for weekday with upper letter', () => {
        const workLogExpression = '2h #ProjectManhattan @Monday';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([MONDAY_BEFORE_TODAY]);
    });

    it('should parse worklog for friday', () => {
        const workLogExpression = '2h #ProjectManhattan @friday';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([FRIDAY_BEFORE_TODAY]);
    });

    it('should parse worklog for last monday', () => {
        const workLogExpression = '2h #ProjectManhattan @last-monday';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([MONDAY_BEFORE_TODAY]);
    });

    it('should parse worklog for next monday', () => {
        const workLogExpression = '2h #ProjectManhattan @next-monday';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([MONDAY_AFTER_TODAY]);
    });

    it('should parse worklog for weekday exactly week before today', () => {
        const workLogExpression = '2h #ProjectManhattan @last-thursday';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([WEEK_BEFORE_TODAY]);
    });

    it('should parse worklog for weekday exactly week after today', () => {
        const workLogExpression = '2h #ProjectManhattan @next-thursday';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([WEEK_AFTER_TODAY]);
    });

    it('should parse worklog for yesterday', () => {
        const workLogExpression = '2h #ProjectManhattan @yesterday';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([YESTERDAY]);
    });

    it('should parse worklog for today', () => {
        const workLogExpression = '2h #ProjectManhattan @today';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([CURRENT_DATE]);
    });

    it('should parse worklog for today if given weekday', () => {
        const workLogExpression = '2h #ProjectManhattan @' + CURRENT_WEEKDAY;

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([CURRENT_DATE]);
    });

    it('should parse worklog for tomorrow', () => {
        const workLogExpression = '2h #ProjectManhattan @tomorrow';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([TOMORROW]);
    });

    it('should parse worklog for yesterday by t-1', () => {
        const workLogExpression = '2h #ProjectManhattan @t-1';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([YESTERDAY]);
    });

    it('should parse worklog for tomorrow by t+1', () => {
        const workLogExpression = '2h #ProjectManhattan @t+1';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([TOMORROW]);
    });

    it('should parse worklog with days and hours', () => {
        const workLogExpression = '1d 3h #ProjectManhattan';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual("1d 3h");
    });

    it('should parse worklog with days and hours', () => {
        const workLogExpression = '1d 5h 15m #ProjectManhattan';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual("1d 5h 15m");
    });

    it('should parse worklog for 1d by default', () => {
        const workLogExpression = '#ProjectManhattan';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual("1d");
    });

    it('should not parse worklog for invalid date', () => {
        const workLogExpression = '#ProjectManhattan @invalid';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
    });

    it('should not parse worklog for invalid text', () => {
        const workLogExpression = 'invalid';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
    });

    it('should not parse worklog for fractions', () => {
        const workLogExpression = '1,5h #ProjectMangattan';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
    });

    it('should not parse empty project', () => {
        const workLogExpression = '#';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
    });

    it('should not parse workload at the end of project name', () => {
        const workLogExpression = '#project2d';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual("1d");
        expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual(["project2d"]);
    });

    it('should parse worklog with hyphen in project for today', () => {
        const workLogExpression = '2h #Project-Manhattan';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual(["Project-Manhattan"]);
    });

    it('should not parse worklog with double day info', () => {
        const workLogExpression = '#Project-Manhattan @monday @tuesday';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
        expect(workLogExpressionParser.parse(workLogExpression)).toBeNull();
    });

    it('should not parse worklog with double workload hours info', () => {
        const workLogExpression = '2h 3h #Project-Manhattan';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
        expect(workLogExpressionParser.parse(workLogExpression)).toBeNull();
    });

    it('should not parse worklog with double workload days info', () => {
        const workLogExpression = '1d 1d #Project-Manhattan';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
        expect(workLogExpressionParser.parse(workLogExpression)).toBeNull();
    });

    it('should not parse worklog with double workload minutes info', () => {
        const workLogExpression = '30m 45m #Project-Manhattan';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
        expect(workLogExpressionParser.parse(workLogExpression)).toBeNull();
    });

    it('should not parse entry with invalid number', () => {
        const workLogExpression = '1h #Project-Manhattan 2h 3h @t-123456789';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
        expect(workLogExpressionParser.parse(workLogExpression)).toBeNull();
    });

    it('should not parse entry with negative workload', () => {
        const workLogExpression = '-10h #Project-Manhattan';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeFalsy();
        expect(workLogExpressionParser.parse(workLogExpression)).toBeNull();
    });

    it('should parse entry for date without trailing zeros', () => {
        const workLogExpression = '4h 30m #Project-Manhattan @2014/1/1';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([YESTERDAY]);
    });

    it('should parse worklog padded with spaces', () => {
        const workLogExpression = '  2h #ProjectManhattan @2014/01/03   ';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression)).toEqual({
                tags: ['ProjectManhattan'],
                workload: '2h',
                days: ['2014/01/03']
            });
    });

    it('should parse multiple projects', () => {
        const workLogExpression = '4h #ProjectManhattan #Apollo @today';

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual([
            'ProjectManhattan', 'Apollo'
        ]);
    });

    it('should parse worklog in order: workload, date, project', () => {
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

    it('should parse worklog in order: date, workload, project', () => {
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

    it('should parse worklog in order: date, project, workload', () => {
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

    it('should parse worklog in order: project, workload, date', () => {
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

    it('should parse worklog in order: project, date, workload', () => {
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

    it('should parse worklog in order: date, project', () => {
        const workLogExpression = new Expression()
            .withDate(SOME_DATE)
            .withProject(SOME_PROJECT)
            .build();

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual([SOME_PROJECT]);
        expect(workLogExpressionParser.parse(workLogExpression).days).toEqual([SOME_DATE]);
    });

    it('should parse worklog in order: project, workload', () => {
        const workLogExpression = new Expression()
            .withProject(SOME_PROJECT)
            .withWorkload(SOME_WORKLOAD)
            .build();

        expect(workLogExpressionParser.isValid(workLogExpression)).toBeTruthy();
        expect(workLogExpressionParser.parse(workLogExpression).tags).toEqual([SOME_PROJECT]);
        expect(workLogExpressionParser.parse(workLogExpression).workload).toEqual(SOME_WORKLOAD);
    });

    class Expression {
        expression = '';

        withWorkload(workload) {
            this.addSpaceIfNeeded();
            this.expression += workload;
            return this;
        };

        withProject(project) {
            this.addSpaceIfNeeded();
            this.expression += '#' + project;
            return this;
        };

        withDate(date) {
            this.addSpaceIfNeeded();
            this.expression += '@' + date;
            return this;
        };

        build() {
            return this.expression;
        };

        addSpaceIfNeeded() {
            if (this.expression.length > 0) {
                this.expression += ' ';
            }
        }
    }
});
