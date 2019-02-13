import React, {Component} from 'react';
import './MonthlyReport.css';

interface MonthlyReportDay {
    id: string;
    weekend: boolean;
    holiday: boolean;
}

interface MonthlyReportProps {
    days: MonthlyReportDay[];
    worklogs: {[employee: string]: any[]}
}

export class MonthlyReport extends Component<MonthlyReportProps, {}> {
    render() {
        return (
            <div className='monthly-report'>

            </div>
        );
    }
}
