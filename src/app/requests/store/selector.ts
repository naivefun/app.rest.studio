import * as _ from 'lodash';
import { createSelector } from 'reselect';
import { RequestsState } from './state';

export const getRequests = (state: RequestsState) => {
    let result = _.orderBy(state.requests, 'createdAt', 'desc');
    return result;
};

export const getResponses = (state: RequestsState) => {
    return state.responses;
};

export const getActiveRequestId = (state: RequestsState) =>
    state.activeRequestId;

export const getActiveRequest = createSelector(getRequests, getActiveRequestId,
    (requests, activeId) => requests.find(request => request.id === activeId));

export const getActiveResponse = createSelector(getResponses, getActiveRequestId,
    (responses, activeId) => {
        return responses[ activeId ];
    });
