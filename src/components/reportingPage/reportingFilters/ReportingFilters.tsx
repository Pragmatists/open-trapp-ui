import React from 'react';
import { Grid } from '@material-ui/core';
import { MonthSelector } from './monthSelector/MonthSelector';
import { WorkLogSelector } from './workLogSelector/WorkLogSelector';
import { ReportingWorkLog } from '../reporting.model';

interface Selection {
  month: { year: number, month: number };
  tags: string[];
  employees: string[];
}

interface ReportingFiltersProps {
  workLogs: ReportingWorkLog[];
  onTagsChange: (values: string[]) => void;
  onEmployeesChange: (values: string[]) => void;
  onMonthChange: (year: number, month: number) => void;
  selection: Selection;
  employeesFilter: (workLog: ReportingWorkLog) => boolean;
  tagsFilter: (workLog: ReportingWorkLog) => boolean;
}


export const ReportingFilters = ({
                                   workLogs, selection, onTagsChange, onEmployeesChange,
                                   onMonthChange, employeesFilter, tagsFilter
                                 }: ReportingFiltersProps) => (
    <Grid item container lg={10} xs={11} spacing={4}>
      <Grid item lg={2} sm={12}>
        <MonthSelector selectedMonth={selection.month} onMonthChange={onMonthChange}/>
      </Grid>
      <Grid item lg={5} sm={12} data-testid='projects-selector'>
        <WorkLogSelector title='Projects'
                         chipLabel={workLog => workLog.projectNames}
                         workLogs={workLogs}
                         selected={selection.tags}
                         workLogFilter={employeesFilter}
                         onSelectionChange={onTagsChange}/>
      </Grid>
      <Grid item lg={5} sm={12} data-testid='employees-selector'>
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.employee}
                         workLogs={workLogs}
                         selected={selection.employees}
                         hideIneligible={true}
                         workLogFilter={tagsFilter}
                         onSelectionChange={onEmployeesChange}/>
      </Grid>
    </Grid>
);
