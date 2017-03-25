import { State } from './reducer';
import { createSelector } from 'reselect';
import {
    getActiveRequest, getActiveRequestId, getRequests
}
    from '../requests/store/selector';

export const getRequestsState = (state: State) => {
    console.debug('global state', state);
    return state.requests;
};

export const getRequestsRequests =
    createSelector(getRequestsState, getRequests);
export const getRequestsActiveId =
    createSelector(getRequestsState, getActiveRequestId);
export const getRequestsActiveRequest =
    createSelector(getRequestsState, getActiveRequest);
