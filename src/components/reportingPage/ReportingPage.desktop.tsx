import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { loadMonthAction, monthChangedAction } from '../../actions/calendar.actions';
import { bulkEditAction, loadTagsAction, removeWorkLogAction, updateWorkLogAction } from '../../actions/workLog.actions';
import './ReportingPage.desktop.scss';
import { EditedWorkLog, ReportingWorkLog } from './reporting.model';
import { chain, includes, intersection, isEmpty } from 'lodash';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import ListIcon from '@material-ui/icons/ViewList';
import ChartIcon from '@material-ui/icons/BarChart';
import { MonthlyReport } from '../monthlyReport/MonthlyReport';
import { MonthlyReportDay, WorkLog } from '../monthlyReport/MonthlyReport.model';
import { TableReport } from './tableReport/TableReport';
import { BulkEditDialog } from './bulkEditDialog/BulkEditDialog';
import { ProjectsReport } from './projectsReport/ProjectsReport';
import { ReportingFilters } from './reportingFilters/ReportingFilters';
import { selectedMonthSelector, usernameSelector, userTagsSelector } from '../../selectors/selectors';

const employeesFilter = (selectedEmployees: string[]) => (w: ReportingWorkLog) => includes(selectedEmployees, w.employee);
const tagsFilter = (selectedTags: string[]) => (w: ReportingWorkLog) => !isEmpty(intersection(selectedTags, w.projectNames));

interface ReportProps {
  days: MonthlyReportDay[];
  tags: string[];
  username: string;
  workLogs: ReportingWorkLog[];
  selection: { employees: string[], tags: string[] },
  onRemoveWorkLog: (id: string) => void;
  onEditWorkLog: (w: EditedWorkLog) => void;
}

const Report = ({days, tags, username, onRemoveWorkLog, onEditWorkLog, workLogs, selection}: ReportProps) => {
  enum ReportType {
    CALENDAR,
    TABLE,
    PROJECTS
  }

  const [reportType, setReportType] = useState(ReportType.CALENDAR);

  const workLogsForSelectedUsersAndTags: { [username: string]: WorkLog[]; } = chain(workLogs)
      .filter(employeesFilter(selection.employees))
      .groupBy(w => w.employee)
      .mapValues(values => values
          .filter(tagsFilter(selection.tags))
          .map(v => ({day: v.day, workload: v.workload}))
      )
      .value();
  const filteredWorkLogs = workLogs
      .filter(employeesFilter(selection.employees))
      .filter(tagsFilter(selection.tags));

  return (
      <Paper className='reporting-page__report report'>
        <Tabs value={reportType}
              onChange={() => {
              }}
              variant='fullWidth'
              indicatorColor='primary'
              textColor='primary'
              className='report__tabs'>
          <Tab icon={<CalendarIcon/>} onClick={() => setReportType(ReportType.CALENDAR)} data-testid='calendar-tab'/>
          <Tab icon={<ListIcon/>} onClick={() => setReportType(ReportType.TABLE)} data-testid='table-tab'/>
          <Tab icon={<ChartIcon/>} onClick={() => setReportType(ReportType.PROJECTS)} data-testid='projects-tab'/>
        </Tabs>
        {reportType === ReportType.CALENDAR && <MonthlyReport days={days} workLogs={workLogsForSelectedUsersAndTags}/>}
        {reportType === ReportType.TABLE && <TableReport workLogs={filteredWorkLogs}
                                                         tags={tags}
                                                         onRemoveWorkLog={onRemoveWorkLog}
                                                         onEditWorkLog={onEditWorkLog}
                                                         username={username}/>
        }
        {reportType === ReportType.PROJECTS && <ProjectsReport workLogs={filteredWorkLogs}/>}
      </Paper>
  );
}

export const ReportingPageDesktop = () => {
  const [selectedEmployees, setSelectedEmployees] = useState(undefined as string[]);
  const [selectedTags, setSelectedTags] = useState(undefined as string[]);
  const days = useSelector((state: OpenTrappState) => state.calendar.days || []);
  const tags = useSelector((state: OpenTrappState) => state.workLog.tags || []);
  const userTags = useSelector(userTagsSelector);
  const username = useSelector(usernameSelector);
  const workLogs = useSelector((state: OpenTrappState) => state.workLog.workLogs || []);
  const selectedMonth = useSelector(selectedMonthSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadMonthAction());
    dispatch(loadTagsAction());
  }, [dispatch]);

  const selection = {
    tags: selectedTags ? selectedTags : userTags,
    employees: selectedEmployees ? selectedEmployees : [username],
    month: selectedMonth
  }

  return (
      <div className='reporting-page'>
        <Grid container justify='center' spacing={3}>
          <Grid item lg={10} xs={11}>
            <div className='reporting-page__header header'>
              <div className='header__text'><span>Review reports</span> by month, project and employee</div>
              <BulkEditDialog username={username} selection={selection} userTags={userTags} onEdit={dto => dispatch(bulkEditAction(dto))}/>
            </div>
            <Divider variant='fullWidth'/>
          </Grid>
          <ReportingFilters workLogs={workLogs.map(w => new ReportingWorkLog(w))}
                            onTagsChange={v => setSelectedTags(v)}
                            onEmployeesChange={v => setSelectedEmployees(v)}
                            onMonthChange={(year, month) => dispatch(monthChangedAction(year, month))}
                            selection={selection}
                            employeesFilter={employeesFilter(selection.employees)}
                            tagsFilter={tagsFilter(selection.tags)}/>
          <Grid item lg={10} xs={11}>
            <Report days={days}
                    tags={tags}
                    username={username}
                    selection={selection}
                    workLogs={workLogs}
                    onRemoveWorkLog={id => dispatch(removeWorkLogAction(id))}
                    onEditWorkLog={w => dispatch(updateWorkLogAction(w.id, w.projectNames, w.workload))}/>
          </Grid>
        </Grid>
      </div>
  );
}
