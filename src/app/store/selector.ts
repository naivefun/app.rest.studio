import { State } from './reducer';
import { createSelector } from 'reselect';
import {
    getActiveRequest, getActiveRequestId, getActiveResponse, getRequests
}
    from '../requests/store/selector';
import { LocalConfig } from '../@shared/config.service';

export const getRequestsState = (state: State) => {
    console.debug('global state', state);
    return state.requests;
};

export const getConfig = (state: State) => {
    return state.config;
};

export const getRequestsRequests =
    createSelector(getRequestsState, getRequests);
export const getRequestsActiveId =
    createSelector(getRequestsState, getActiveRequestId);
export const getRequestsActiveRequest =
    createSelector(getRequestsState, getActiveRequest);
export const getRequestsActiveResponse =
    createSelector(getRequestsState, getActiveResponse);

export const getConnections =
    createSelector(getConfig, (state: LocalConfig) => state.connectedAccounts);
