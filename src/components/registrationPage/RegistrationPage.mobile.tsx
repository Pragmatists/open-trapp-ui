import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { OpenTrappState } from '../../redux/root.reducer';
import { loadTags, loadWorkLogs } from '../../redux/workLog.actions';
import { DaySelector } from './daySelector/DaySelector';
import { ParsedWorkLog } from '../../workLogExpressionParser/ParsedWorkLog';
import moment from 'moment';
import { changeWorkLog, createPreset, removePreset } from '../../redux/registration.actions';
import { PresetsSelector } from './presetsSelector/PresetsSelector';
import { Preset } from './registration.model';

interface RegistrationPageDataProps {
  selectedMonth: { year: number, month: number };
  workLog: ParsedWorkLog;
  presets: Preset[];
  tags: string[];
}

interface RegistrationPageEventProps {
  init: (year: number, month: number) => void;
  onWorkLogChange: (workLog: ParsedWorkLog) => void;
  onRemovePreset: (preset: Preset) => void;
  onCreatePreset: (preset: Preset) => void;
}

type RegistrationPageProps = RegistrationPageDataProps & RegistrationPageEventProps;

class RegistrationPageMobileComponent extends Component<RegistrationPageProps, {}> {

  componentDidMount(): void {
    const {selectedMonth, init} = this.props;
    init(selectedMonth.year, selectedMonth.month);
  }

  render() {
    const {presets, tags, onRemovePreset, onCreatePreset} = this.props;
    return (
        <div className='registration-page'>
          <DaySelector selectedDay={this.selectedDay} onChange={this.handleDayChange}/>
          <PresetsSelector presets={presets}
                           onClick={this.handlePresetClicked}
                           onCreate={onCreatePreset}
                           onRemove={onRemovePreset}
                           tags={tags} />
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
  };

  private handlePresetClicked: (preset: Preset) => {

  };
}

function mapStateToProps(state: OpenTrappState): RegistrationPageDataProps {
  const {selectedMonth} = state.calendar;
  const {workLog, presets} = state.registration;
  const {expression, workload, days, tags} = workLog;
  return {
    selectedMonth,
    workLog: new ParsedWorkLog(expression, days, tags, workload),
    presets,
    tags: state.workLog.tags
  };
}

function mapDispatchToProps(dispatch): RegistrationPageEventProps {
  return {
    init(year: number, month: number) {
      dispatch(loadWorkLogs(year, month));
      dispatch(loadTags());
    },
    onWorkLogChange(workLog: ParsedWorkLog) {
      dispatch(changeWorkLog(workLog));
    },
    onCreatePreset(preset: Preset) {
      dispatch(createPreset(preset));
    },
    onRemovePreset(preset: Preset) {
      dispatch(removePreset(preset));
    }
  }
}

export const RegistrationPageMobile = connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationPageMobileComponent);
