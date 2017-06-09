import * as _ from 'lodash';
import { DefaultHttpResponse } from '../../@model/http/http-response';
import { SimpleAction } from '../../@store/action.types';
import { mergeState } from '../../@utils/store.utils';
import { IRequestsState } from '../store/state';
import { RequestsActions } from './actions';

const INITIAL_STATE: IRequestsState = {
    requests: [],
    responses: {},
};

export function requestsReducer(state: IRequestsState = INITIAL_STATE, action: SimpleAction<any>) {
    switch (action.type) {
        case RequestsActions.LOAD_REQUESTS:
            return mergeState(state, { loadingRequests: true });
        case RequestsActions.LOAD_REQUESTS_SUCCESS: {
            let requests = action.payload || [];
            requests = _.orderBy(requests, ['createdAt'], ['desc']);
            return mergeState(state, { loadingRequests: false, requests });
        }
        case RequestsActions.LOAD_REQUESTS_ERROR:
            return mergeState(state, { loadingRequests: false });
        case RequestsActions.SELECT_REQUEST: {
            let activeRequestId = state.activeRequestId;
            let id = action.payload;
            if (id) {
                for (let request of state.requests) {
                    if (request.id === id) {
                        activeRequestId = id;
                        break;
                    }
                }

                return mergeState(state, { activeRequestId });
            }
        }
        case RequestsActions.RESPONSE_RECEIVED: {
            let responses = state.responses;
            let response: DefaultHttpResponse = action.payload;
            responses[response.requestId] = response;
            return mergeState(state, { responses });
        }
        case RequestsActions.CLEAR_RESPONSE: {
            delete state.responses[action.payload];
            return mergeState(state, { responses: state.responses });
        }
        case RequestsActions.DELETE_REQUEST: {
            let id = action.payload;
            if (id) {
                let requests = state.requests.filter(req => req.id !== id);
                return mergeState(state, { requests });
            }
        }
        default:
    }

    return state;
};
