import moment from "moment";

export class Month {
    private static readonly FORMAT = 'YYYY/MM';
    private month: moment.Moment;

    constructor(month: string) {
        this.month = moment(month, Month.FORMAT);
    }

    get name(): string {
        return this.month.format(Month.FORMAT);
    }

    get next(): Month {
        const nextMonth = moment(this.month).add(1, 'month');
        return Month.fromDate(nextMonth);
    }

    get prev(): Month {
        const prevMonth = moment(this.month).subtract(1, 'month');
        return Month.fromDate(prevMonth);
    }

    static fromDate(moment: moment.Moment): Month {
        return new Month(moment.format(Month.FORMAT));
    }
}
