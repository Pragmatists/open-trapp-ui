import React, { Component } from 'react';
import { connect } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { changeMonth, loadMonth } from '../../redux/calendar.actions';
import { loadTags, loadWorkLogs, removeWorkLog, updateWorkLog } from '../../redux/workLog.actions';
import './ReportingPage.desktop.scss';
import { changeEmployees, changeReportType, changeTags } from '../../redux/reporting.actions';
import { EditedWorkLog, ReportingWorkLog } from './reporting.model';
import { chain, includes, intersection, isEmpty, uniq } from 'lodash';
import { AuthorizedUser, DayDTO, ReportingWorkLogDTO } from '../../api/dtos';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import ListIcon from '@material-ui/icons/ViewList';
import ChartIcon from '@material-ui/icons/BarChart';
import { MonthlyReport } from '../monthlyReport/MonthlyReport';
import { WorkLog } from '../monthlyReport/MonthlyReport.model';
import { ReportType } from '../../redux/reporting.reducer';
import { TableReport } from './tableReport/TableReport';
import { BulkEditDialog } from './bulkEditDialog/BulkEditDialog';
import { ProjectsReport } from './projectsReport/ProjectsReport';
import { ReportingFilters } from './reportingFilters/ReportingFilters';

interface Selection {
  month: { year: number, month: number };
  tags: string[];
  employees: string[];
}

interface ReportingPageDataProps {
  workLogs: ReportingWorkLog[];
  tags: string[]
  selection: Selection;
  days: DayDTO[];
  reportType: ReportType;
  username: string;
}

interface ReportingPageEventProps {
  onMonthChange: (year: number, month: number) => void;
  init: (year: number, month: number) => void;
  onTagsChange: (values: string[]) => void;
  onEmployeesChange: (values: string[]) => void;
  onReportTypeChange: (type: ReportType) => void;
  onRemoveWorkLog: (id: string) => void;
  onEditWorkLog: (workLog: EditedWorkLog) => void;
}

type ReportingPageProps = ReportingPageDataProps & ReportingPageEventProps;

class ReportingPageDesktopComponent extends Component<ReportingPageProps, {}> {
  componentDidMount(): void {
    const {init, selection} = this.props;
    const {month, year} = selection.month;
    init(year, month);
  }

  render() {
    const {
      selection, username, workLogs, tags, days, reportType,
      onMonthChange, onTagsChange, onEmployeesChange, onReportTypeChange, onRemoveWorkLog, onEditWorkLog
    } = this.props;
    return (
        <div className='reporting-page'>
          <Grid container justify='center' spacing={3}>
            <Grid item lg={10} xs={11}>
              <div className='reporting-page__header header'>
                <div className='header__text'><span>Review reports</span> by month, project and employee</div>
                <BulkEditDialog />
              </div>
              <Divider variant='fullWidth'/>
            </Grid>
            <ReportingFilters workLogs={workLogs}
                              onTagsChange={onTagsChange}
                              onEmployeesChange={onEmployeesChange}
                              onMonthChange={onMonthChange}
                              selection={selection}
                              employeesFilter={this.employeesFilter}
                              tagsFilter={this.tagsFilter}/>
            <Grid item container lg={10} xs={11}>
              <Paper className='reporting-page__report report'>
                <Tabs value={reportType}
                      onChange={() => {}}
                      variant='fullWidth'
                      indicatorColor='primary'
                      textColor='primary'
                      className='report__tabs'>
                  <Tab icon={<CalendarIcon/>} onClick={() => onReportTypeChange(ReportType.CALENDAR)} data-testid='calendar-tab'/>
                  <Tab icon={<ListIcon/>} onClick={() => onReportTypeChange(ReportType.TABLE)} data-testid='table-tab'/>
                  <Tab icon={<ChartIcon/>} onClick={() => onReportTypeChange(ReportType.PROJECTS)} data-testid='projects-tab'/>
                </Tabs>
                {reportType === ReportType.CALENDAR && <MonthlyReport days={days}
                                                                      workLogs={this.workLogsForSelectedUsersAndTags}/>
                }
                {reportType === ReportType.TABLE && <TableReport workLogs={this.filteredWorkLogs}
                                                                 tags={tags}
                                                                 onRemoveWorkLog={onRemoveWorkLog}
                                                                 onEditWorkLog={onEditWorkLog}
                                                                 username={username}/>
                }
                {reportType === ReportType.PROJECTS && <ProjectsReport workLogs={this.filteredWorkLogs} />}
              </Paper>
            </Grid>
          </Grid>
        </div>
    );
  }

  private get employeesFilter() {
    const {employees} = this.props.selection;
    return (workLog: ReportingWorkLog) => includes(employees, workLog.employee);
  };

  private get tagsFilter() {
    const {tags} = this.props.selection;
    return (workLog: ReportingWorkLog) => !isEmpty(intersection(tags, workLog.projectNames));
  };

  private get workLogsForSelectedUsersAndTags(): { [username: string]: WorkLog[]; } {
    const {workLogs} = this.props;
    return chain(workLogs)
        .filter(this.employeesFilter)
        .groupBy(w => w.employee)
        .mapValues(values => values
            .filter(this.tagsFilter)
            .map(v => ({day: v.day, workload: v.workload}))
        )
        .value();
  }

  private get filteredWorkLogs(): ReportingWorkLog[] {
    const {workLogs} = this.props;
    return workLogs
        .filter(this.employeesFilter)
        .filter(this.tagsFilter);
  }
}

function tagsForUser(workLogs: ReportingWorkLogDTO[], username: string): string[] {
  const tags = workLogs
      .filter(w => w.employee === username)
      .map(w => w.projectNames)
      .reduce((curr, prev) => [...curr, ...prev], []);
  return uniq(tags);
}

function mapStateToProps(state: OpenTrappState): ReportingPageDataProps {
  const {selectedMonth, days = []} = state.calendar;
  const {workLogs = [], tags = []} = state.workLog;
  const {selectedTags, selectedEmployees, reportType} = state.reporting;
  const {user = {} as AuthorizedUser} = state.authentication;
  return {
    selection: {
      month: selectedMonth,
      tags: selectedTags ? selectedTags : tagsForUser(workLogs, user.name),
      employees: selectedEmployees ? selectedEmployees : [user.name]
    },
    username: user.name,
    workLogs: workLogs.map(w => new ReportingWorkLog(w)),
    days,
    tags,
    reportType
  };
}

function mapDispatchToProps(dispatch): ReportingPageEventProps {
  return {
    init(year: number, month: number) {
      dispatch(loadMonth(year, month));
      dispatch(loadWorkLogs(year, month));
      dispatch(loadTags());
    },
    onMonthChange(year: number, month: number) {
      dispatch(changeMonth(year, month));
      dispatch(loadWorkLogs(year, month));
    },
    onTagsChange(values: string[]) {
      dispatch(changeTags(values));
    },
    onEmployeesChange(values: string[]) {
      dispatch(changeEmployees(values));
    },
    onReportTypeChange(type: ReportType) {
      dispatch(changeReportType(type));
    },
    onRemoveWorkLog(id: string) {
      dispatch(removeWorkLog(id));
    },
    onEditWorkLog(workLog: EditedWorkLog) {
      dispatch(updateWorkLog(workLog.id, workLog.projectNames, workLog.workload));
    }
  };
}

export const ReportingPageDesktop = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingPageDesktopComponent);
