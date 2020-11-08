import { REGISTRATION_CONSTANTS } from './constants';
import { Preset } from '../components/registrationPage/registration.model';

export const loadPresetsAction = (limit?: number) => ({
  type: REGISTRATION_CONSTANTS.LOAD_PRESETS,
  payload: limit
});

export type LoadPresetsAction = ReturnType<typeof loadPresetsAction>;

export const presetsLoadedAction = (presets: Preset[]) => ({
  type: REGISTRATION_CONSTANTS.PRESETS_LOADED,
  payload: presets
});
