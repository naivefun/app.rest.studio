//// global reducers
import { RequestsState } from '../requests/store/state';
import { reducer as RequestsReducer } from '../requests/store/reducer';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { RouterState } from '@ngrx/router-store';

export interface State {
    router: RouterState;
    requests: RequestsState;
}

const reducers = {
    requests: RequestsReducer
};

const devReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
    console.debug('calling reducer', state, action);
    return devReducer(state, action);
}
