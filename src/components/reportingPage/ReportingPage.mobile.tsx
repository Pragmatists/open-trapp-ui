import React, { Component } from 'react';
import { connect } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { loadWorkLogs } from '../../redux/workLog.actions';
import { MobileWorkLog } from './mobileWorkLog/MobileWorkLog';
import { ReportingWorkLogDTO } from '../../api/dtos';
import { List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';

interface ReportingPageDataProps {
  selectedMonth: { month: number, year: number },
  workLogs: ReportingWorkLogDTO[]
}

interface ReportingPageEventProps {
  init: (year: number, month: number) => void;
}

type ReportingPageProps = ReportingPageDataProps & ReportingPageEventProps;

class ReportingPageMobileComponent extends Component<ReportingPageProps, {}> {
  componentDidMount(): void {
    const {init, selectedMonth} = this.props;
    const {month, year} = selectedMonth;
    init(year, month);
  }

  render() {
    return (
        <List>
          <ListSubheader>{`I'm sticky`}</ListSubheader>
          {this.props.workLogs.map(workLog =>
              <ListItem key={workLog.id}>
                <MobileWorkLog key={workLog.id} workLog={workLog}/>
              </ListItem>
          )}
        </List>
    );
  }
}

function mapStateToProps(state: OpenTrappState): ReportingPageDataProps {
  const {selectedMonth} = state.calendar;
  const workLogs = state.workLog.workLogs.filter(workLog => workLog.employee === state.authentication.user.name);
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
  };
}

export const ReportingPageMobile = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingPageMobileComponent);
