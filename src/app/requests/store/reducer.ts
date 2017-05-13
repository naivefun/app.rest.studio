import * as _ from 'lodash';
import { DefaultHttpRequest, HttpRequestParam } from '../../@model/http/http-request';
import { DefaultHttpResponse } from '../../@model/http/http-response';
import { mergeState } from '../../@utils/store.utils';
import { RequestsActions, RequestsActionTypes } from './action';
import { RequestsInitialState, RequestsState } from './state';

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
        // case RequestsActionTypes.SAVE_ACTIVE_REQUEST:
        //     return handleSaveActiveRequest(state);
        case RequestsActionTypes.SAVE_REQUEST_SUCCESS:
            return handleSaveRequestSuccess(state, action.payload as DefaultHttpRequest);
        case RequestsActionTypes.LOAD_REQUESTS_SUCCESS:
            return handleLoadRequestsSuccess(state, action.payload as DefaultHttpRequest[]);
        case RequestsActionTypes.DELETE_REQUEST:
            return handleDeleteRequest(state, action.payload as string);
        case RequestsActionTypes.UP_REQUEST:
            return handleUpRequest(state, action.payload as string);
        case RequestsActionTypes.SELECT_REQUEST:
            return handleSelectRequest(state, action.payload as string);
        case RequestsActionTypes.RESPONSE_RECEIVED:
            return handleResponseReceived(state, action.payload as DefaultHttpResponse);
        case RequestsActionTypes.CLEAR_RESPONSE:
            return handleClearResponse(state, action.payload as string);
        case RequestsActionTypes.UPDATE_REQUEST_PARAMS:
            return handleUpdateRequestParams(state, action.payload as { [property: string]: HttpRequestParam });
        default:
            return state;
    }
}

// region handlers
function handleCreateRequest(state: RequestsState, request: DefaultHttpRequest) {
    request = request || DefaultHttpRequest.defaultRequest();
    let requests = [ request, ...state.requests ];
    console.debug('created request', requests);
    return mergeState(state, { requests });
}

function handleUpdateRequest(state: RequestsState, request: DefaultHttpRequest) {
    let requests = state.requests;
    if (request) {
        requests = requests.map(req => {
            if (req.id === request.id) {
                return Object.assign({}, request);
            }
            return req;
        });
    }

    return mergeState(state, { requests });
}

function handleUpdateRequestParams(state: RequestsState, options: { [property: string]: HttpRequestParam }) {
    let request = state.requests.find(r => r.id === state.activeRequestId);
    let keys = Object.keys(options);
    if (request) {
        let updateParams = (params: HttpRequestParam[]) => {
            params.forEach(p => {
                if (_.indexOf(keys, p.id) >= 0) {
                    p.value = '123456677asdfasdf';
                }
            });
            return params;
            // return params.map(p => {
            //     if (_.indexOf(keys, p.id) >= 0) {
            //         return Object.assign({}, options[ p.id ]);
            //     } else {
            //         return p;
            //     }
            // });
        };

        // request.headerParams = updateParams(request.headerParams);
        // request.queryParams = updateParams(request.queryParams);
        return handleUpdateRequest(state, request);
    }

    return state;
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

function handleUpRequest(state: RequestsState, id: string) {
    let request = _.find(state.requests, req => req.id === id);
    if (request) {
        _.pull(state.requests, request);
        let requests = [ request, ...state.requests ];
        request.createdAt = Date.now();
        return mergeState(state, { requests });
    } else {
        return state;
    }
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
    responses[ response.requestId ] = response;
    return mergeState(state, { responses });
}

function handleClearResponse(state: RequestsState, requestId: string) {
    let responses = _.clone(state.responses);
    responses[ requestId ] = null;
    return mergeState(state, { responses });
}

// endregion
