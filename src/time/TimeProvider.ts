import * as moment from 'moment';
import {Month} from "./Month";

export class TimeProvider {
    getCurrentDate() {
        return new Date();
    }

    get moment() {
        return moment();
    }

    get currentMonth() {
        return Month.fromDate(this.moment);
    }
}
