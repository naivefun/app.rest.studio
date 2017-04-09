import * as _ from 'lodash';
import { RequestsInitialState, RequestsState } from './state';
import { RequestsActions, RequestsActionTypes } from './action';
import { DefaultHttpRequest } from '../../@model/http/http-request';
import { mergeState } from '../../@utils/store.utils';
import { DefaultHttpResponse } from '../../@model/http/http-response';

export function reducer(state = RequestsInitialState, action: RequestsActions): RequestsState {
    switch (action.type) {
        case RequestsActionTypes.LOAD_REQUESTS:
            return handleLoadRequests(state);
        case RequestsActionTypes.UPDATE_REQUEST:
            return handleUpdateRequest(state, action.payload as DefaultHttpRequest);
        case RequestsActionTypes.CREATE_REQUEST:
            return handleCreateRequest(state, action.payload as DefaultHttpRequest);
        case RequestsActionTypes.SAVE_REQUEST:
            return handleSaveRequest(state, action.payload as DefaultHttpRequest);
        case RequestsActionTypes.SAVE_REQUEST_SUCCESS:
            return handleSaveRequestSuccess(state, action.payload as DefaultHttpRequest);
        case RequestsActionTypes.LOAD_REQUESTS_SUCCESS:
            return handleLoadRequestsSuccess(state, action.payload as DefaultHttpRequest[]);
        case RequestsActionTypes.DELETE_REQUEST:
            return handleDeleteRequest(state, action.payload as string);
        case RequestsActionTypes.SELECT_REQUEST:
            return handleSelectRequest(state, action.payload as string);
        case RequestsActionTypes.RESPONSE_RECEIVED:
            return handleResponseReceived(state, action.payload as DefaultHttpResponse);
        case RequestsActionTypes.CLEAR_RESPONSE:
            return handleClearResponse(state, action.payload as string);
        default:
            return state;
    }
}

// region handlers
function handleCreateRequest(state: RequestsState, request: DefaultHttpRequest) {
    request = request || DefaultHttpRequest.defaultRequest();
    let requests = [request, ...state.requests];
    console.debug('created request', requests);
    return mergeState(state, { requests });
}

function handleUpdateRequest(state: RequestsState, request: DefaultHttpRequest) {
    let requests = state.requests;
    if (request) {
        requests = requests.map(req => {
            if (req.id === request.id) {
                return request;
            }

            return req;
        });
    }

    return mergeState(state, { requests });
}

function handleSaveRequest(state: RequestsState, request: DefaultHttpRequest) {
    let requests = state.requests.map(req => {
        if (req.id === request.id) {
            return request;
        } else {
            return req;
        }
    });

    return mergeState(state, { requests, savingRequest: true });
}

function handleSaveRequestSuccess(state: RequestsState, request: DefaultHttpRequest) {
    // TODO: replace with new request
    return mergeState(state, { savingRequest: false });
}

function handleDeleteRequest(state: RequestsState, id: string) {
    let requests = state.requests.filter(req => req.id !== id);
    return mergeState(state, { requests });
}

function handleLoadRequests(state: RequestsState) {
    return mergeState(state, { loadingRequests: true });
}

function handleLoadRequestsSuccess(state: RequestsState, requests: DefaultHttpRequest[]) {
    requests = requests || [];
    if (requests.length === 0) {
        requests.push(DefaultHttpRequest.defaultRequest());
    }

    let activeRequestId = state.activeRequestId;
    if (!activeRequestId) {
        activeRequestId = requests[0].id;
    }

    return mergeState(state, { requests, activeRequestId, loadingRequests: false });
}

function handleSelectRequest(state: RequestsState, id: string) {
    let activeRequestId = state.activeRequestId;
    for (let request of state.requests) {
        if (request.id === id) {
            activeRequestId = id;
            break;
        }
    }

    return mergeState(state, { activeRequestId });
}

function handleResponseReceived(state: RequestsState, response: DefaultHttpResponse) {
    let responses = _.clone(state.responses);
    responses[response.requestId] = response;
    return mergeState(state, { responses });
}

function handleClearResponse(state: RequestsState, requestId: string) {
    let responses = _.clone(state.responses);
    responses[requestId] = null;
    return mergeState(state, { responses });
}

// endregion
