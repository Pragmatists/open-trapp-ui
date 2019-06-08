import React, { Component } from 'react';
import { Grid } from "@material-ui/core";
import './RegistrationPage.desktop.scss'
import Divider from "@material-ui/core/Divider";
import { WorkLogInput } from "./workLogInput/WorkLogInput";
import { connect } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { changeMonth, loadMonth } from '../../redux/calendar.actions';
import { AuthorizedUser, DayDTO, ReportingWorkLogDTO } from '../../api/dtos';
import { loadTags, loadWorkLogs } from '../../redux/workLog.actions';
import { WorkLog } from '../monthlyReport/MonthlyReport.model';
import { isEmpty } from 'lodash';
import { RulesDialog } from './rulesDialog/RulesDialog';
import { RegistrationPageMonth } from '../registrationPageMonth/RegistrationPageMonth';
import { ParsedWorkLog } from '../../workLogExpressionParser/ParsedWorkLog';
import { changeWorkLog, saveWorkLog } from '../../redux/registration.actions';

interface RegistrationPageDataProps {
  selectedMonth: { year: number, month: number };
  days?: DayDTO[];
  workLogs: { [employee: string]: WorkLog[] };
  workLog: ParsedWorkLog;
  tags: string[];
}

interface RegistrationPageEventProps {
  init: (year: number, month: number) => void;
  onMonthChange: (year: number, month: number) => void;
  onWorkLogInputChange: (workLog: ParsedWorkLog) => void;
  onSaveWorkLog: (workLog: ParsedWorkLog) => void;
}

type RegistrationPageProps = RegistrationPageDataProps & RegistrationPageEventProps;

class RegistrationPageDesktopComponent extends Component<RegistrationPageProps, {}> {

  componentDidMount(): void {
    const {init, selectedMonth} = this.props;
    init(selectedMonth.year, selectedMonth.month);
  }

  render() {
    const {days, workLogs, workLog, selectedMonth, onMonthChange, onWorkLogInputChange, onSaveWorkLog, tags} = this.props;
    return (
        <div className='registration-page'>
          <Grid container justify='center' spacing={3}>
            <Grid item lg={10} md={11} xs={11}>
              <div className='registration-page__header'>
                <span>Report your time</span> using our expression language, to make it quick!
                <RulesDialog/>
              </div>
              <Divider variant='fullWidth'/>
            </Grid>
            <Grid item lg={10} md={11} xs={11}>
              <WorkLogInput onChange={onWorkLogInputChange} onSave={onSaveWorkLog} workLog={workLog} tags={tags}/>
            </Grid>
            <Grid item lg={10} md={11} xs={11}>
              {days && !isEmpty(workLogs) ?
                  <RegistrationPageMonth selectedMonth={selectedMonth}
                                         selectedDays={workLog.days}
                                         days={days}
                                         workLogs={workLogs}
                                         onChange={onMonthChange}
                                         onDaysSelected={this.onDaysSelected}/> :
                  'Loading...'
              }
            </Grid>
          </Grid>
        </div>
    );
  }

  private onDaysSelected = (days: string[]) => {
    const {onWorkLogInputChange, workLog} = this.props;
    onWorkLogInputChange(workLog.withDays(days));
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
  const {workLogs, tags} = state.workLog;
  const workLog = state.registration.workLog;
  const userWorkLogs = workLogsForUser(name, workLogs);
  return {
    selectedMonth,
    days,
    workLogs: userWorkLogs,
    workLog: new ParsedWorkLog(workLog.expression, workLog.days, workLog.tags, workLog.workload),
    tags
  };
}

function mapDispatchToProps(dispatch): RegistrationPageEventProps {
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
    onWorkLogInputChange(workLog: ParsedWorkLog) {
      dispatch(changeWorkLog(workLog));
    },
    onSaveWorkLog(workLog: ParsedWorkLog) {
      dispatch(saveWorkLog(workLog));
    }
  };
}

export const RegistrationPageDesktop = connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationPageDesktopComponent);
