import { Action } from '@ngrx/store';
import { LocalConfig } from '../@shared/config.service';
import { mergeState, type } from '../@utils/store.utils';
import { KEYS } from '../@shared/db.service';

export const ConfigActionTypes = {
    UPDATE_CONFIG: type('UPDATE_CONFIG'),
};

export type ConfigActions =
    UpdateConfigAction;

export function reducer(state = { connectedAccounts: [], id: KEYS.LOCAL_CONFIG }, action: ConfigActions): LocalConfig {
    switch (action.type) {
        case ConfigActionTypes.UPDATE_CONFIG:
            let config = action.payload as LocalConfig;
            let connectedAccounts = config.connectedAccounts.filter($ => true);
            return mergeState(state, { connectedAccounts });
        default:
            return state;
    }
}

export class UpdateConfigAction implements Action {
    public type = ConfigActionTypes.UPDATE_CONFIG;

    constructor(public payload: LocalConfig) {
    }
}
