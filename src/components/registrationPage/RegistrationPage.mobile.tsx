import React, {Component} from 'react';
import {connect} from 'react-redux';
import {isNil} from 'lodash';
import {OpenTrappState} from '../../redux/root.reducer';
import {loadTags, loadWorkLogs, removeWorkLog} from '../../redux/workLog.actions';
import {DaySelector} from './daySelector/DaySelector';
import {ParsedWorkLog} from '../../workLogExpressionParser/ParsedWorkLog';
import {changeWorkLog, loadPresets, saveWorkLog} from '../../redux/registration.actions';
import {PresetsSelector} from './presetsSelector/PresetsSelector';
import {Preset} from './registration.model';
import {WorkloadDialog} from './workloadDialog/WorkloadDialog';
import {WorkLogs} from './workLogs/WorkLogs';
import {ReportingWorkLogDTO} from '../../api/dtos';

interface RegistrationPageDataProps {
  selectedMonth: { year: number, month: number };
  workLog: ParsedWorkLog;
  presets: Preset[];
  tags: string[];
  workLogs: ReportingWorkLogDTO[];
}

interface RegistrationPageEventProps {
  init: (year: number, month: number) => void;
  onWorkLogChange: (workLog: ParsedWorkLog) => void;
  onSaveWorkLog: (workLog: ParsedWorkLog) => void;
  onDeleteWorkLog: (workLog: ReportingWorkLogDTO) => void;
}

type RegistrationPageProps = RegistrationPageDataProps & RegistrationPageEventProps;

interface RegistrationPageMobileState {
  selectedPreset?: Preset;
}

class RegistrationPageMobileComponent extends Component<RegistrationPageProps, RegistrationPageMobileState> {
  state = {
    selectedPreset: undefined as Preset
  };

  componentDidMount(): void {
    const {selectedMonth, init} = this.props;
    init(selectedMonth.year, selectedMonth.month);
  }

  render() {
    const {presets, tags, workLogs, onDeleteWorkLog} = this.props;
    const {selectedPreset} = this.state;
    return (
        <div className='registration-page'>
          <DaySelector selectedDay={this.selectedDay} onChange={this.handleDayChange}/>
          <WorkLogs workLogs={workLogs} onDelete={onDeleteWorkLog} />
          <PresetsSelector presets={presets}
                           onClick={this.handlePresetClicked}
                           onCreate={() => {}}
                           tags={tags}/>
          <WorkloadDialog open={!isNil(selectedPreset)} onClose={this.handleWorkloadDialogClose} />
        </div>
    );
  }

  private get selectedDay(): string {
    const {workLog} = this.props;
    return workLog.days[0];
  }

  private handleDayChange = (day: string) => {
    const {onWorkLogChange, workLog} = this.props;
    const newWorkLog = workLog.withDays([day]);
    onWorkLogChange(newWorkLog);
  };

  private handlePresetClicked = (preset: Preset) => this.setState({
    selectedPreset: preset
  });

  private handleWorkloadDialogClose = (workload?: string) => {
    const {onSaveWorkLog} = this.props;
    const {selectedPreset} = this.state;
    if (workload) {
      const workLog = new ParsedWorkLog(
          `${workload} ${selectedPreset.toString()} @${this.selectedDay}`,
          [this.selectedDay],
          selectedPreset.tags,
          workload
      );
      onSaveWorkLog(workLog);
    }
    this.setState({
      selectedPreset: undefined
    });
  }
}
function mapStateToProps(state: OpenTrappState): RegistrationPageDataProps {
  const {selectedMonth} = state.calendar;
  const {workLog, presets} = state.registration;
  const {expression, workload, days, tags} = workLog;
  return {
    selectedMonth,
    workLog: new ParsedWorkLog(expression, days, tags, workload),
    workLogs: state.workLog.workLogs.filter(forSelected(state)).filter(forCurrentUser(state)),
    presets,
    tags: state.workLog.tags
  };
}

function forSelected(state: OpenTrappState) {
  return workLog => workLog.day === state.registration.workLog.days[0];
}

function forCurrentUser(state: OpenTrappState) {
  return workLog => workLog.employee === state.authentication.user.name;
}

function mapDispatchToProps(dispatch): RegistrationPageEventProps {
  return {
    init(year: number, month: number) {
      dispatch(loadWorkLogs(year, month));
      dispatch(loadTags());
      dispatch(loadPresets());
    },
    onWorkLogChange(workLog: ParsedWorkLog) {
      dispatch(changeWorkLog(workLog));
    },
    onSaveWorkLog(workLog: ParsedWorkLog) {
      dispatch(saveWorkLog(workLog));
    },
    onDeleteWorkLog(workLog: ReportingWorkLogDTO) {
      dispatch(removeWorkLog(workLog.id));
    }
  }
}

export const RegistrationPageMobile = connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationPageMobileComponent);
