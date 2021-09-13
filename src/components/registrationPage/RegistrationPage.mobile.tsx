import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {isNil} from 'lodash';
import {OpenTrappState} from '../../redux/root.reducer';
import {
  loadTagsAction,
  loadWorkLogsAction,
  removeWorkLogAction,
  saveWorkLogAction,
  workLogChangedAction
} from '../../actions/workLog.actions';
import {DaySelector} from './daySelector/DaySelector';
import {ParsedWorkLog} from '../../workLogExpressionParser/ParsedWorkLog';
import {loadPresetsAction} from '../../actions/registration.actions';
import {Preset} from './registration.model';
import {WorkLogs} from './workLogs/WorkLogs';
import {CreateWorkLogDialog} from './createWorkLogDialog/CreateWorkLogDialog';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Chip from '@material-ui/core/Chip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import './RegistrationPage.mobile.scss';

const forSelectedDay = (state: OpenTrappState) => workLog => workLog.day === state.registration.workLog.days[0];

const forCurrentUser = (state: OpenTrappState) => workLog => workLog.employee === state.authentication.user.name;

export const RegistrationPageMobile = () => {
  const [selectedPreset, setSelectedPreset] = useState(undefined as Preset);
  const [customWorkLogDialogOpen, setCustomWorkLogDialogOpen] = useState(false);
  const presets = useSelector((state: OpenTrappState) => state.registration.presets);
  const tags = useSelector((state: OpenTrappState) => state.workLog.tags);
  const workLogs = useSelector((state: OpenTrappState) => state.workLog.workLogs.filter(forSelectedDay(state)).filter(forCurrentUser(state)));
  const workLog = useSelector((state: OpenTrappState) => {
    const {expression, workload, days, tags} = state.registration.workLog;
    return new ParsedWorkLog(expression, days, tags, workload);
  })
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadWorkLogsAction());
    dispatch(loadTagsAction(6));
    dispatch(loadPresetsAction());
  }, [dispatch]);

  const selectedDay = workLog.days[0];

  const handleCancel = () => {
    setCustomWorkLogDialogOpen(false);
    setSelectedPreset(undefined);
  }

  const handleSave = (tags: string[], workload: string, description?: string) => {
    const workLog = ParsedWorkLog.from(tags, selectedDay, workload);
    dispatch(saveWorkLogAction(workLog.withNote(description)));
    handleCancel()
  };

  return (
      <div className='registration-page-mobile'>
        <DaySelector selectedDay={selectedDay} onChange={day => dispatch(workLogChangedAction((workLog.withDays([day]))))} />
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
        <CreateWorkLogDialog onSave={handleSave}
                             onCancel={handleCancel}
                             open={customWorkLogDialogOpen || !isNil(selectedPreset)}
                             selectedTags={selectedPreset?.tags}
                             tags={tags} />
        <Fab onClick={() => setCustomWorkLogDialogOpen(true)}
             color='primary'
             className='registration-page-mobile__add-button add-button'
             data-testid='custom-work-log-button'>
          <AddIcon />
        </Fab>
      </div>
  );
}
