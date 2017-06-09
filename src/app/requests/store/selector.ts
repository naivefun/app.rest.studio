import * as _ from 'lodash';
import { createSelector } from 'reselect';
import { IRequestsState } from './state';

export const getRequests = (state: IRequestsState) => {
    let result = _.orderBy(state.requests, 'createdAt', 'desc');
    return result;
};

export const getResponses = (state: IRequestsState) => {
    return state.responses;
};

export const getActiveRequestId = (state: IRequestsState) =>
    state.activeRequestId;

export const getActiveRequest = createSelector(getRequests, getActiveRequestId,
    (requests, activeId) => requests.find(request => request.id === activeId));

export const getActiveResponse = createSelector(getResponses, getActiveRequestId,
    (responses, activeId) => {
        return responses[ activeId ];
    });
