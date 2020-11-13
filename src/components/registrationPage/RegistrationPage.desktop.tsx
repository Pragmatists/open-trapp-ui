import React, { useEffect } from 'react';
import './RegistrationPage.desktop.scss'
import Divider from "@material-ui/core/Divider";
import { WorkLogInput } from "./workLogInput/WorkLogInput";
import { useDispatch, useSelector } from 'react-redux';
import { OpenTrappState } from '../../redux/root.reducer';
import { loadMonthAction, monthChangedAction } from '../../actions/calendar.actions';
import { AuthorizedUser } from '../../api/dtos';
import { loadTagsAction, saveWorkLogAction, workLogChangedAction } from '../../actions/workLog.actions';
import { isEmpty } from 'lodash';
import { RulesDialog } from './rulesDialog/RulesDialog';
import { RegistrationPageMonth } from '../registrationPageMonth/RegistrationPageMonth';
import { ParsedWorkLog } from '../../workLogExpressionParser/ParsedWorkLog';
import { loadPresetsAction } from '../../actions/registration.actions';
import { Month } from '../../utils/Month';
import { extractAutoAddedTagsMapping } from '../../utils/tagUtils'
import { selectedMonthSelector } from '../../selectors/selectors';

const workLogsSelector = (state: OpenTrappState) => {
  const {name} = state.authentication.user || {} as AuthorizedUser;
  const {workLogs} = state.workLog;
  if (!workLogs) {
    return {};
  }
  const filteredWorkLogs = workLogs
      .filter(w => w.employee === name)
      .map(w => ({day: w.day, workload: w.workload}));
  return {[name]: filteredWorkLogs};
}

const AUTO_ADDED_TAGS_MAPPING = extractAutoAddedTagsMapping();

export const RegistrationPageDesktop = () => {
  const presets = useSelector((state: OpenTrappState) => state.registration.presets);
  const tags = useSelector((state: OpenTrappState) => state.workLog.tags);
  const days = useSelector((state: OpenTrappState) => state.calendar.days);
  const selectedMonth = useSelector(selectedMonthSelector);
  const workLogs = useSelector(workLogsSelector);
  const workLog = useSelector((state: OpenTrappState) => {
    const w = state.registration.workLog;
    return new ParsedWorkLog(w.expression, w.days, w.tags, w.workload);
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadMonthAction());
    dispatch(loadTagsAction());
    dispatch(loadPresetsAction());
  }, [dispatch]);
  const onMonthChange = (month: Month) => dispatch(monthChangedAction(month.year, month.month));
  const onDaysSelected = (days: string[]) => dispatch(workLogChangedAction(workLog.withDays(days)));
  const onWorkLogInputChange = (workLog: ParsedWorkLog) => dispatch(workLogChangedAction(workLog));
  const onSaveWorkLog = (workLog: ParsedWorkLog) => dispatch(saveWorkLogAction(workLog));

  return (
      <div className='registration-page'>
        <div className='registration-page__header'>
          <span>Report your time</span> using our expression language, to make it quick!
          <RulesDialog/>
        </div>
        <Divider variant='fullWidth'/>
        <div className='registration-page__input'>
          <WorkLogInput onChange={onWorkLogInputChange}
                        onSave={onSaveWorkLog}
                        workLog={workLog}
                        tags={tags}
                        presets={presets}
                        autoAddedTagsMapping={AUTO_ADDED_TAGS_MAPPING}/>
        </div>
        <div>
          {days && !isEmpty(workLogs) ?
              <RegistrationPageMonth selectedMonth={new Month(selectedMonth.year, selectedMonth.month)}
                                     selectedDays={workLog.days}
                                     days={days}
                                     workLogs={workLogs}
                                     onChange={onMonthChange}
                                     onDaysSelected={onDaysSelected}/> :
              'Loading...'
          }
        </div>
      </div>
  );
}
