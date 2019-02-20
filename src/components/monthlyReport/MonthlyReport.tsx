import React, {Component} from 'react';
import './MonthlyReport.scss';
import {MonthlyReportDay} from "./MonthlyReport.model";

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
