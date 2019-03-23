import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { OpenTrappState } from '../../redux/root.reducer';
import { loadTags, loadWorkLog } from '../../redux/workLog.actions';
import { DaySelector } from './daySelector/DaySelector';
import { ParsedWorkLog } from '../../workLogExpressionParser/ParsedWorkLog';
import moment from 'moment';
import { changeWorkLog } from '../../redux/registration.actions';

interface RegistrationPageDataProps {
  selectedMonth: { year: number, month: number };
  workLog: ParsedWorkLog;
}

interface RegistrationPageEventProps {
  init: (year: number, month: number) => void;
  onWorkLogChange: (workLog: ParsedWorkLog) => void;
}

type RegistrationPageProps = RegistrationPageDataProps & RegistrationPageEventProps;

class RegistrationPageMobileComponent extends Component<RegistrationPageProps, {}> {

  componentDidMount(): void {
    const {selectedMonth, init} = this.props;
    init(selectedMonth.year, selectedMonth.month);
  }

  render() {
    return (
        <div className='registration-page'>
          <DaySelector selectedDay={this.selectedDay} onChange={this.handleDayChange}/>
        </div>
    );
  }

  private get selectedDay(): string {
    const {workLog} = this.props;
    return isEmpty(workLog.days) ? moment().format('YYYY/MM/DD') : workLog.days[0];
  }

  private handleDayChange = (day: string) => {
    const {onWorkLogChange, workLog} = this.props;
    const newWorkLog = workLog.withDays([day]);
    onWorkLogChange(newWorkLog);
  }
}

function mapStateToProps(state: OpenTrappState): RegistrationPageDataProps {
  const {selectedMonth} = state.calendar;
  const {expression, workload} = state.registration;
  return {
    selectedMonth,
    workLog: new ParsedWorkLog(expression, state.registration.days, state.registration.tags, workload),
  };
}

function mapDispatchToProps(dispatch): RegistrationPageEventProps {
  return {
    init(year: number, month: number) {
      dispatch(loadWorkLog(year, month));
      dispatch(loadTags());
    },
    onWorkLogChange(workLog: ParsedWorkLog) {
      dispatch(changeWorkLog(workLog));
    }
  }
}

export const RegistrationPageMobile = connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationPageMobileComponent);
