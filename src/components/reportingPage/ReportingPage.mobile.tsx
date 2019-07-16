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

interface ReportingPageDataProps {
  selectedMonth: Month;
  workLogs: ReportingWorkLogDTO[];
  days: DayDTO[];
}

interface ReportingPageEventProps {
  init: (year: number, month: number) => void;
  onEditDay: (day: string) => void;
  onMonthChange: (month: Month) => void;
}

type ReportingPageProps = ReportingPageDataProps & ReportingPageEventProps;

class ReportingPageMobileComponent extends Component<ReportingPageProps, {}> {
  componentDidMount(): void {
    const {init, selectedMonth} = this.props;
    const {month, year} = selectedMonth;
    init(year, month);
  }

  render() {
    const {onEditDay, selectedMonth, onMonthChange} = this.props;
    return (
        <div>
          <MonthSelector selectedMonth={selectedMonth}
                         onChange={onMonthChange}/>
          <List>
            {this.workLogsByDay.map(day =>
                <ListItem key={day.day}>
                  <DayCard day={day.day}
                           weekend={day.weekend}
                           workLogs={day.workLogs}
                           onEditClick={() => onEditDay(day.day)} data-day-card={day.day}/>
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
}

function mapStateToProps(state: OpenTrappState): ReportingPageDataProps {
  const {calendar, workLog, authentication} = state;
  const {selectedMonth, days = []} = calendar;
  const workLogs = workLog.workLogs.filter(workLog => workLog.employee === authentication.user.name);
  return {
    selectedMonth: new Month(selectedMonth.year, selectedMonth.month),
    workLogs,
    days
  };
}

function mapDispatchToProps(dispatch): ReportingPageEventProps {
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
      // TODO
    }
  };
}

export const ReportingPageMobile = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingPageMobileComponent);
