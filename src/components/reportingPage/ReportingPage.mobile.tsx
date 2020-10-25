import React, { Component } from 'react';
import { connect } from 'react-redux';
import { groupBy } from 'lodash';
import { OpenTrappState } from '../../redux/root.reducer';
import { loadWorkLogs } from '../../redux/workLog.actions';
import { DayCard } from './dayCard/DayCard';
import { DayDTO, ReportingWorkLogDTO } from '../../api/dtos';
import { List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import { changeMonth, loadMonth } from '../../redux/calendar.actions';
import { MonthSelector } from './monthSelector/MonthSelector';
import { Month } from '../../utils/Month';
import { History, Location } from 'history';
import { changeWorkLog } from '../../redux/registration.actions';
import { ParsedWorkLog } from '../../workLogExpressionParser/ParsedWorkLog';
import { match, withRouter } from 'react-router';

interface DataProps {
  selectedMonth: Month;
  workLogs: ReportingWorkLogDTO[];
  days: DayDTO[];
}

interface EventProps {
  init: (year: number, month: number) => void;
  onEditDay: (day: string) => void;
  onMonthChange: (month: Month) => void;
}

interface OwnProps {
  history: History<any>;
  location: Location<any>;
  match: match<any>;
}

type Props = DataProps & EventProps & OwnProps;

class ReportingPageMobileComponent extends Component<Props, {}> {
  componentDidMount(): void {
    const {init, selectedMonth} = this.props;
    const {month, year} = selectedMonth;
    init(year, month);
  }

  render() {
    const {selectedMonth, onMonthChange} = this.props;
    return (
        <div>
          <MonthSelector selectedMonth={selectedMonth} onChange={onMonthChange}/>
          <List>
            {this.workLogsByDay.map(day =>
                <ListItem key={day.day}>
                  <DayCard day={day.day}
                           weekend={day.weekend}
                           workLogs={day.workLogs}
                           onEditClick={() => this.onEditDay(day.day)} />
                </ListItem>
            )}
          </List>
        </div>
    );
  }

  private get workLogsByDay() {
    const {workLogs, days} = this.props;
    const groupedWorkLogs = groupBy(workLogs, w => w.day);
    return days
        .sort((d1, d2) => d2.id.localeCompare(d1.id))
        .map(d => ({day: d.id, weekend: d.weekend, workLogs: groupedWorkLogs[d.id] || []}))
        .filter(d => d.workLogs.length > 0);
  }

  private onEditDay(day: string) {
    const {onEditDay, history} = this.props;
    onEditDay(day);
    history.push('/registration');
  }
}

function mapStateToProps(state: OpenTrappState, ownProps: OwnProps): DataProps & OwnProps {
  const {calendar, workLog, authentication} = state;
  const {selectedMonth, days = []} = calendar;
  const workLogs = workLog.workLogs.filter(workLog => workLog.employee === authentication.user.name);
  return {
    selectedMonth: new Month(selectedMonth.year, selectedMonth.month),
    workLogs,
    days,
    ...ownProps
  };
}

function mapDispatchToProps(dispatch): EventProps {
  return {
    init(year: number, month: number) {
      dispatch(loadMonth(year, month));
      dispatch(loadWorkLogs(year, month));
    },
    onMonthChange(month: Month) {
      dispatch(changeMonth(month.year, month.month));
      dispatch(loadWorkLogs(month.year, month.month));
    },
    onEditDay(day: string) {
      dispatch(changeWorkLog(ParsedWorkLog.empty().withDays([day])));
    }
  };
}

export const ReportingPageMobile = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ReportingPageMobileComponent)
);
