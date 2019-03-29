import React, { Component } from 'react';
import { connect } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { changeMonth, loadMonth } from '../../redux/calendar.actions';
import { loadWorkLogs, removeWorkLog, updateWorkLog } from '../../redux/workLog.actions';
import './ReportingPage.desktop.scss';
import { MonthSelector } from './monthSelector/MonthSelector';
import { WorkLogSelector } from './workLogSelector/WorkLogSelector';
import { changeEmployees, changeReportType, changeTags } from '../../redux/reporting.actions';
import { EditedWorkLog, ReportingWorkLog } from './reporting.model';
import { chain, includes, intersection, isEmpty } from 'lodash';
import { DayDTO, ReportingWorkLogDTO } from '../../api/dtos';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import ListIcon from '@material-ui/icons/ViewList';
import { MonthlyReport } from '../monthlyReport/MonthlyReport';
import { WorkLog } from '../monthlyReport/MonthlyReport.model';
import { ReportType } from '../../redux/reporting.reducer';
import { TableReport } from './tableReport/TableReport';

interface Selection {
  month: { year: number, month: number };
  tags: string[];
  employees: string[];
}

interface ReportingPageDataProps {
  workLogs: ReportingWorkLog[];
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
      selection, username, workLogs, days, reportType,
      onMonthChange, onTagsChange, onEmployeesChange, onReportTypeChange, onRemoveWorkLog, onEditWorkLog
    } = this.props;
    return (
        <div className='reporting-page'>
          <Grid container justify='center' spacing={24}>
            <Grid item lg={10} xs={11}>
              <div className='reporting-page__header'>
                <span>Review reports</span> by month, project and employee
              </div>
              <Divider variant='fullWidth'/>
            </Grid>
            <Grid item container lg={10} xs={11} spacing={32}>
              <Grid item lg={2} sm={12} data-months-selector>
                <MonthSelector selectedMonth={selection.month} onMonthChange={onMonthChange}/>
              </Grid>
              <Grid item lg={5} sm={12} data-projects-selector>
                <WorkLogSelector title='Projects'
                                 chipLabel={workLog => workLog.projectNames}
                                 workLogs={workLogs}
                                 selected={selection.tags}
                                 workLogFilter={this.employeesFilter}
                                 onSelectionChange={onTagsChange}/>
              </Grid>
              <Grid item lg={5} sm={12} data-employees-selector>
                <WorkLogSelector title='Employees'
                                 chipLabel={workLog => workLog.employee}
                                 workLogs={workLogs}
                                 selected={selection.employees}
                                 workLogFilter={this.tagsFilter}
                                 onSelectionChange={onEmployeesChange}/>
              </Grid>
            </Grid>
            <Grid item container lg={10} xs={11}>
              <Paper className='reporting-page__report report'>
                <Tabs value={reportType}
                      onChange={() => {}}
                      variant='fullWidth'
                      indicatorColor='secondary'
                      textColor='secondary'
                      className='report__tabs'>
                  <Tab icon={<CalendarIcon/>} onClick={() => onReportTypeChange(ReportType.CALENDAR)} data-reporting-calendar-tab/>
                  <Tab icon={<ListIcon/>} onClick={() => onReportTypeChange(ReportType.TABLE)} data-reporting-table-tab/>
                </Tabs>
                {reportType === ReportType.CALENDAR && <MonthlyReport days={days}
                                                                      workLogs={this.workLogsForSelectedUsersAndTags}/>
                }
                {reportType === ReportType.TABLE && <TableReport workLogs={this.filteredWorkLogs}
                                                                 onRemoveWorkLog={onRemoveWorkLog}
                                                                 onEditWorkLog={onEditWorkLog}
                                                                 username={username}/>
                }
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
    return chain(workLogs)
        .filter(this.employeesFilter)
        .filter(this.tagsFilter)
        .value();
  }
}

function tagsForUser(workLogs: ReportingWorkLogDTO[], username: string): string[] {
  return chain(workLogs)
      .filter(w => w.employee === username)
      .map(w => w.projectNames)
      .flatten()
      .uniq()
      .value();
}

function mapStateToProps(state: OpenTrappState): ReportingPageDataProps {
  const {selectedMonth, days} = state.calendar;
  const {workLogs = []} = state.workLog;
  const {selectedTags, selectedEmployees, reportType} = state.reporting;
  const {name} = state.authentication.user;
  return {
    selection: {
      month: selectedMonth,
      tags: selectedTags ? selectedTags : tagsForUser(workLogs, name),
      employees: selectedEmployees ? selectedEmployees : [name]
    },
    username: name,
    workLogs: workLogs.map(w => new ReportingWorkLog(w)),
    days: days || [],
    reportType
  };
}

function mapDispatchToProps(dispatch): ReportingPageEventProps {
  return {
    init(year: number, month: number) {
      dispatch(loadMonth(year, month));
      dispatch(loadWorkLogs(year, month));
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
