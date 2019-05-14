import React, { Component } from 'react';
import { connect } from 'react-redux';
import { groupBy, toPairs } from 'lodash';
import { OpenTrappState } from '../../redux/root.reducer';
import { loadWorkLogs } from '../../redux/workLog.actions';
import { DayCard } from './dayCard/DayCard';
import { ReportingWorkLogDTO } from '../../api/dtos';
import { List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';

interface ReportingPageDataProps {
  selectedMonth: { month: number, year: number },
  workLogs: ReportingWorkLogDTO[]
}

interface ReportingPageEventProps {
  init: (year: number, month: number) => void;
  onEditDay: (day: string) => void;
}

type ReportingPageProps = ReportingPageDataProps & ReportingPageEventProps;

class ReportingPageMobileComponent extends Component<ReportingPageProps, {}> {
  componentDidMount(): void {
    const {init, selectedMonth} = this.props;
    const {month, year} = selectedMonth;
    init(year, month);
  }

  render() {
    const {onEditDay} = this.props;
    return (
        <List>
          {this.workLogsByDay.map(day =>
              <ListItem key={day.day}>
                <DayCard day={day.day} workLogs={day.workLogs} onEditClick={() => onEditDay(day.day)}/>
              </ListItem>
          )}
        </List>
    );
  }

  private get workLogsByDay() {
    const {workLogs} = this.props;
    const groupedWorkLogs = groupBy(workLogs, w => w.day);
    return toPairs(groupedWorkLogs)
        .map(p => ({day: p[0], workLogs: p[1]}))
  }
}

function mapStateToProps(state: OpenTrappState): ReportingPageDataProps {
  const {calendar, workLog, authentication} = state;
  const {selectedMonth} = calendar;
  const workLogs = workLog.workLogs.filter(workLog => workLog.employee === authentication.user.name);
  return {
    selectedMonth,
    workLogs
  };
}

function mapDispatchToProps(dispatch): ReportingPageEventProps {
  return {
    init(year: number, month: number) {
      dispatch(loadWorkLogs(year, month));
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
