import { createSelector } from 'reselect';
import { RequestsState } from './state';
import * as _ from 'lodash';

export const getRequests = (state: RequestsState) => {
    console.debug('getRequests', state);
    let result = _.sortBy(state.requests, 'createdAt', 'desc');
    return result;
};

export const getResponses = (state: RequestsState) => {
    console.debug('running getResponses', state.responses);
    return state.responses;
};

export const getActiveRequestId = (state: RequestsState) =>
    state.activeRequestId;

export const getActiveRequest = createSelector(getRequests, getActiveRequestId,
    (requests, activeId) => requests.find(request => request.id === activeId));

export const getActiveResponse = createSelector(getResponses, getActiveRequestId,
    (responses, activeId) => {
        console.debug('running getActiveResponse', responses, activeId);
        return responses[activeId];
    });
