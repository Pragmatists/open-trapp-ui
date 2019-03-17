import React, { Component } from 'react';
import { connect } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { changeMonth, loadMonth } from '../../redux/calendar.actions';
import { loadWorkLog } from '../../redux/workLog.actions';
import './ReportingPage.desktop.scss';
import { MonthSelector } from './monthSelector/MonthSelector';
import { WorkLogSelector } from './workLogSelector/WorkLogSelector';
import { changeEmployees, changeReportType, changeTags } from '../../redux/reporting.actions';
import { ReportingWorkLog } from './reporting.model';
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
import { TableReport } from '../tableReport/TableReport';

interface ReportingPageDataProps {
  selectedMonth: { year: number, month: number };
  workLogs: ReportingWorkLog[];
  selectedTags: string[];
  selectedEmployees: string[];
  days: DayDTO[];
  reportType: ReportType;
}

interface ReportingPageEventProps {
  onMonthChange: (year: number, month: number) => void;
  init: (year: number, month: number) => void;
  onTagsChange: (values: string[]) => void;
  onEmployeesChange: (values: string[]) => void;
  onReportTypeChange: (type: ReportType) => void;
}

type ReportingPageProps = ReportingPageDataProps & ReportingPageEventProps;

class ReportingPageDesktopComponent extends Component<ReportingPageProps, {}> {
  componentDidMount(): void {
    const {init, selectedMonth} = this.props;
    init(selectedMonth.year, selectedMonth.month);
  }

  render() {
    const {
      selectedMonth, onMonthChange, workLogs, selectedEmployees, selectedTags, onTagsChange, onEmployeesChange, days, reportType, onReportTypeChange
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
                <MonthSelector selectedMonth={selectedMonth} onMonthChange={onMonthChange}/>
              </Grid>
              <Grid item lg={5} sm={12} data-projects-selector>
                <WorkLogSelector title='Projects'
                                 chipLabel={workLog => workLog.projectNames}
                                 workLogs={workLogs}
                                 selected={selectedTags}
                                 workLogFilter={this.projectsFilter}
                                 onSelectionChange={onTagsChange}/>
              </Grid>
              <Grid item lg={5} sm={12} data-employees-selector>
                <WorkLogSelector title='Employees'
                                 chipLabel={workLog => workLog.employee}
                                 workLogs={workLogs}
                                 selected={selectedEmployees}
                                 workLogFilter={this.employeesFilter}
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
                {reportType === ReportType.CALENDAR && <MonthlyReport days={days} workLogs={this.workLogsForSelectedUsers}/>}
                {reportType === ReportType.TABLE && <TableReport/>}
              </Paper>
            </Grid>
          </Grid>
        </div>
    );
  }

  private get projectsFilter() {
    const {selectedEmployees} = this.props;
    return (workLog: ReportingWorkLog) => includes(selectedEmployees, workLog.employee);
  };

  private get employeesFilter() {
    const {selectedTags} = this.props;
    return (workLog: ReportingWorkLog) => !isEmpty(intersection(selectedTags, workLog.projectNames));
  };

  private get workLogsForSelectedUsers(): { [username: string]: WorkLog[]; } {
    const {workLogs, selectedEmployees} = this.props;
    return chain(workLogs)
        .filter(w => includes(selectedEmployees, w.employee))
        .groupBy(w => w.employee)
        .mapValues(values => values.map(v => ({day: v.day, workload: v.workload})))
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
    selectedMonth,
    workLogs: workLogs.map(w => new ReportingWorkLog(w)),
    selectedTags: selectedTags ? selectedTags : tagsForUser(workLogs, name),
    selectedEmployees: selectedEmployees ? selectedEmployees : [name],
    days: days || [],
    reportType
  };
}

function mapDispatchToProps(dispatch): ReportingPageEventProps {
  return {
    init(year: number, month: number) {
      dispatch(loadMonth(year, month));
      dispatch(loadWorkLog(year, month));
    },
    onMonthChange(year: number, month: number) {
      dispatch(changeMonth(year, month));
      dispatch(loadWorkLog(year, month));
    },
    onTagsChange(values: string[]) {
      dispatch(changeTags(values));
    },
    onEmployeesChange(values: string[]) {
      dispatch(changeEmployees(values));
    },
    onReportTypeChange(type: ReportType) {
      dispatch(changeReportType(type));
    }
  };
}

export const ReportingPageDesktop = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingPageDesktopComponent);