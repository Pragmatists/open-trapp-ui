import { combineEpics } from 'redux-observable';
import { loadMonthEpic } from './monthEpic';
import {
  bulkEditWorkLogsEpic,
  loadTagsEpic,
  loadWorkLogsEpic,
  removeWorkLogEpic,
  saveWorkLogEpic,
  updateWorkLogEpic
} from './workLogEpics';
import { deleteServiceAccountEpic, loadAuthorizedUsersEpic, loadServiceAccountsEpic } from './adminEpics';
import { loadPresetsEpic } from './registrationEpics';

export default combineEpics(
    loadMonthEpic,
    loadWorkLogsEpic,
    saveWorkLogEpic,
    removeWorkLogEpic,
    updateWorkLogEpic,
    loadServiceAccountsEpic,
    deleteServiceAccountEpic,
    loadAuthorizedUsersEpic,
    loadPresetsEpic,
    loadTagsEpic,
    bulkEditWorkLogsEpic
);
