//// global reducers
import { RequestsState } from '../requests/store/state';
import { reducer as RequestsReducer } from '../requests/store/reducer';
import { reducer as ConfigReducer } from './config-reducer';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { RouterState } from '@ngrx/router-store';
import { LocalConfig } from '../@shared/config.service';

export interface State {
    router: RouterState;
    config: LocalConfig;
    requests: RequestsState;
}

const reducers = {
    requests: RequestsReducer,
    config: ConfigReducer
};

const devReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
    console.debug('calling reducer', state, action);
    return devReducer(state, action);
}
