import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isNil } from 'lodash';
import { OpenTrappState } from '../../redux/root.reducer';
import {
  loadTagsAction,
  loadWorkLogsAction,
  removeWorkLogAction,
  saveWorkLogAction,
  workLogChangedAction
} from '../../actions/workLog.actions';
import { DaySelector } from './daySelector/DaySelector';
import { ParsedWorkLog } from '../../workLogExpressionParser/ParsedWorkLog';
import { loadPresetsAction} from '../../actions/registration.actions';
import { Preset } from './registration.model';
import { WorkloadDialog } from './workloadDialog/WorkloadDialog';
import { WorkLogs } from './workLogs/WorkLogs';
import { CreateWorkLogDialog } from './createWorkLogDialog/CreateWorkLogDialog';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Chip } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import './RegistrationPage.mobile.scss';
import { selectedMonthSelector } from '../../selectors/selectors';

const forSelectedDay = (state: OpenTrappState) => workLog => workLog.day === state.registration.workLog.days[0];

const forCurrentUser = (state: OpenTrappState) => workLog => workLog.employee === state.authentication.user.name;

export const RegistrationPageMobile = () => {
  const [selectedPreset, setSelectedPreset] = useState(undefined as Preset);
  const [customWorkLogDialogOpen, setCustomWorkLogDialogOpen] = useState(false);
  const selectedMonth = useSelector(selectedMonthSelector);
  const presets = useSelector((state: OpenTrappState) => state.registration.presets);
  const tags = useSelector((state: OpenTrappState) => state.workLog.tags);
  const workLogs = useSelector((state: OpenTrappState) => state.workLog.workLogs.filter(forSelectedDay(state)).filter(forCurrentUser(state)));
  const workLog = useSelector((state: OpenTrappState) => {
    const {expression, workload, days, tags} = state.registration.workLog;
    return new ParsedWorkLog(expression, days, tags, workload);
  })
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadWorkLogsAction(selectedMonth.year, selectedMonth.month));
    dispatch(loadTagsAction(6));
    dispatch(loadPresetsAction());
  }, []);

  const selectedDay =  workLog.days[0];

  const handleWorkloadDialogClose = (workload?: string) => {
    if (workload) {
      const workLog = ParsedWorkLog.from(selectedPreset.tags, selectedDay, workload);
      dispatch(saveWorkLogAction(workLog));
    }
    setSelectedPreset(undefined);
  };

  const handleCustomWorkLogDialogClose = (tags?: string[], workload?: string) => {
    if (tags && workload) {
      const workLog = ParsedWorkLog.from(tags, selectedDay, workload);
      dispatch(saveWorkLogAction(workLog));
    }
    setCustomWorkLogDialogOpen(false);
  };

  return (
        <div className='registration-page'>
          <DaySelector selectedDay={selectedDay} onChange={day => dispatch(workLogChangedAction((workLog.withDays([day]))))}/>
          <WorkLogs workLogs={workLogs} onDelete={workLogId => dispatch(removeWorkLogAction(workLogId))} />
          <div className='presets-selector'>
            <List className='presets-selector__list'>
              <ListSubheader className='presets-selector__title'>Suggested projects</ListSubheader>
              {
                presets.map((preset, idx) => (
                    <Chip key={idx}
                          label={preset.tags.join(', ')}
                          onClick={() => setSelectedPreset(preset)}
                          className='presets-selector__chip chip'
                          color={'primary'}
                          data-testid='preset' />
                ))
              }
            </List>
          </div>
          <WorkloadDialog open={!isNil(selectedPreset)} onClose={handleWorkloadDialogClose} />
          <CreateWorkLogDialog onClose={handleCustomWorkLogDialogClose} open={customWorkLogDialogOpen} tags={tags} />
          <Fab onClick={() => setCustomWorkLogDialogOpen(true)}
               color='primary'
               className='registration-page__add-button add-button'
               data-testid='custom-work-log-button'>
            <AddIcon />
          </Fab>
        </div>
    );
}
