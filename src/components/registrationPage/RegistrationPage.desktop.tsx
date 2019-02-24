import React, { Component } from 'react';
import { Grid } from "@material-ui/core";
import './RegistrationPage.desktop.scss'
import Divider from "@material-ui/core/Divider";
import { WorkLogInput } from "../workLogInput/WorkLogInput";
import { MonthlyReport } from '../monthlyReport/MonthlyReport';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { loadMonth } from '../../redux/calendar.actions';
import { AuthorizedUser, DayDTO, ReportingWorkLogDTO } from '../../api/dtos';
import { loadWorkLog } from '../../redux/workLog.actions';
import { WorkLog } from '../monthlyReport/MonthlyReport.model';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { RulesDialog } from '../rulesDialog/RulesDialog';

interface RegistrationPageDataProps {
  selectedMonth: { year: number, month: number },
  days?: DayDTO[];
  workLogs: { [employee: string]: WorkLog[] }
}

interface RegistrationPageEventProps {
  init: (year: number, month: number) => void;
}

type RegistrationPageProps = RegistrationPageDataProps & RegistrationPageEventProps;

class RegistrationPageDesktopComponent extends Component<RegistrationPageProps, {}> {

  componentDidMount(): void {
    const {init, selectedMonth} = this.props;
    init(selectedMonth.year, selectedMonth.month);
  }

  render() {
    const {days, workLogs, selectedMonth} = this.props;
    return (
        <div className='registration-page'>
          <Grid container justify='center' spacing={24}>
            <Grid item xs={8}>
              <div className='registration-page__header'>
                <span>Report your time</span> using our expression language, to make it quick!
                <RulesDialog />
              </div>
              <Divider variant='fullWidth'/>
            </Grid>
            <Grid item xs={8}>
              <WorkLogInput/>
            </Grid>
            <Grid item xs={8}>
              <div className='registration-page__header' data-selected-month-header>
                <span>{moment([selectedMonth.year, selectedMonth.month - 1, 1]).format('YYYY/MM')}</span> month worklog
              </div>
              <Divider variant='fullWidth'/>
              <div className='registration-page__description'>
                <span>Click</span> on date to set it on worklog expression
              </div>
              <div className='registration-page__description'>
                <span>Shift + Click</span> on date to set dates range on worklog expression
              </div>
              <Paper>
                {days && !isEmpty(workLogs) ? <MonthlyReport days={days} workLogs={workLogs}/> : 'Loading...'}
              </Paper>
            </Grid>
          </Grid>
        </div>
    );
  }
}

function workLogsForUser(name: string, workLogs?: ReportingWorkLogDTO[]): { [p: string]: WorkLog[] } {
  if (!workLogs) {
    return {};
  }
  const filteredWorkLogs = workLogs
      .filter(w => w.employee === name)
      .map(w => ({day: w.day, workload: w.workload}));
  return {[name]: filteredWorkLogs};
}

function mapStateToProps(state: OpenTrappState): RegistrationPageDataProps {
  const {selectedMonth, days} = state.calendar;
  const {name} = state.authentication.user || {} as AuthorizedUser;
  const {workLogs} = state.workLog;
  const userWorkLogs = workLogsForUser(name, workLogs);
  return {
    selectedMonth,
    days,
    workLogs: userWorkLogs
  };
}

function mapDispatchToProps(dispatch): RegistrationPageEventProps {
  return {
    init: (year, month) => {
      dispatch(loadMonth(year, month));
      dispatch(loadWorkLog(year, month));
    }
  };
}

export const RegistrationPageDesktop = connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationPageDesktopComponent);
