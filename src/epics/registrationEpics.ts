import { OpenTrappAPI } from '../api/OpenTrappAPI';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators';
import { OpenTrappState } from '../redux/root.reducer';
import { REGISTRATION_CONSTANTS } from '../actions/constants';
import { LoadPresetsAction, presetsLoadedAction } from '../actions/registration.actions';
import { Preset } from '../components/registrationPage/registration.model';

export const loadPresetsEpic = (action$: ActionsObservable<LoadPresetsAction>, state$: StateObservable<OpenTrappState>, {openTrappApi}: {openTrappApi: OpenTrappAPI}) =>
    action$.pipe(
        ofType(REGISTRATION_CONSTANTS.LOAD_PRESETS),
        map(a => a.payload),
        mergeMap(limit => openTrappApi.presets(limit)),
        map(presets => presets.map(p => new Preset(p))),
        map(presetsLoadedAction)
    );
