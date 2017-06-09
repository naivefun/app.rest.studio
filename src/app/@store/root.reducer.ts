import { composeReducers, defaultFormReducer } from '@angular-redux/form';
import { combineReducers } from 'redux';
import { requestsReducer } from '../requests/@store/reducer';
import { routerReducer } from '@angular-redux/router';

export const rootReducer = composeReducers(
    defaultFormReducer(),
    combineReducers({
        requests: requestsReducer,
        routes: routerReducer,
    })
);
