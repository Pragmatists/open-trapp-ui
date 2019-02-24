import {shallow} from "enzyme";
import {MonthlyReport} from "./MonthlyReport";

const someMonth = [{
    id: '2018/12/01',
    weekend: true,
    holiday: false
}, {
    id: '2018/12/02',
    weekend: true,
    holiday: false
}, {
    id: '2018/12/03',
    weekend: false,
    holiday: false
}, {
    id: '2018/12/04',
    weekend: false,
    holiday: false
}, {
    id: '2018/12/05',
    weekend: false,
    holiday: false
}, {
    id: '2018/12/06',
    weekend: false,
    holiday: false
}, {
    id: '2018/12/07',
    weekend: false,
    holiday: false
}];

describe('MonthlyReport', () => {
    it('should render days for specified month', () => {
        const wrapper = shallow(<MonthlyReport days={someMonth} workLogs={{}}/>);
    });

    it('should return selected day on click', () => {

    });
});
