import { MonthSelector } from './monthSelector/MonthSelector';
import { WorkLogSelector } from './workLogSelector/WorkLogSelector';
import { ReportingWorkLog } from '../reporting.model';
import './ReportingFilters.scss';

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

export const ReportingFilters = ({workLogs, selection, onTagsChange, onEmployeesChange, onMonthChange, employeesFilter, tagsFilter}: ReportingFiltersProps) => (
    <div className='reporting-filters'>
      <div>
        <MonthSelector selectedMonth={selection.month} onMonthChange={onMonthChange}/>
      </div>
      <div data-testid='projects-selector'>
        <WorkLogSelector title='Projects'
                         chipLabel={workLog => workLog.projectNames}
                         workLogs={workLogs}
                         selected={selection.tags}
                         workLogFilter={employeesFilter}
                         onSelectionChange={onTagsChange}/>
      </div>
      <div data-testid='employees-selector'>
        <WorkLogSelector title='Employees'
                         chipLabel={workLog => workLog.employee}
                         workLogs={workLogs}
                         selected={selection.employees}
                         hideIneligible={true}
                         workLogFilter={tagsFilter}
                         onSelectionChange={onEmployeesChange}/>
      </div>
    </div>
);
