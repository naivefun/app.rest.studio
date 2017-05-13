import { type } from '../../@utils/store.utils';
import { Action } from '@ngrx/store';
import { DefaultHttpRequest, HttpRequestParam } from '../../@model/http/http-request';
import { DefaultHttpResponse } from '../../@model/http/http-response';

export const RequestsActionTypes = {
    CREATE_REQUEST: type('CREATE_REQUEST'),
    SELECT_REQUEST: type('SELECT_REQUEST'),
    UPDATE_REQUEST: type('UPDATE_REQUEST'),
    UPDATE_REQUEST_PARAMS: type('UPDATE_REQUEST_PARAMS'),
    RESPONSE_RECEIVED: type('RESPONSE_RECEIVED'),
    SAVE_REQUEST: type('SAVE_REQUEST'),
    SAVE_ACTIVE_REQUEST: type('SAVE_ACTIVE_REQUEST'),
    SAVE_REQUEST_SUCCESS: type('SAVE_REQUEST_SUCCESS'),
    UP_REQUEST: type('UP_REQUEST'),
    DELETE_REQUEST: type('DELETE_REQUEST'),
    DELETE_REQUEST_SUCCESS: type('DELETE_REQUEST_SUCCESS'),
    LOAD_REQUESTS: type('LOAD_REQUESTS'),
    LOAD_REQUESTS_SUCCESS: type('LOAD_REQUESTS_SUCCESS'),
    CLEAR_RESPONSE: type('CLEAR_RESPONSE')
};

export type RequestsActions =
    CreateRequestAction |
    UpdateRequestAction |
    SaveRequestAction |
    DeleteRequestAction |
    LoadRequestsAction |
    ResponseReceivedAction
    ;

// region Action Definition
export class CreateRequestAction implements Action {
    public type = RequestsActionTypes.CREATE_REQUEST;

    constructor(public payload: DefaultHttpRequest) {
    }
}

export class UpdateRequestAction implements Action {
    public type = RequestsActionTypes.UPDATE_REQUEST;

    constructor(public payload: DefaultHttpRequest) {
    }
}

export class UpdateRequestParamsAction implements Action {
    public type = RequestsActionTypes.UPDATE_REQUEST_PARAMS;

    constructor(public payload: { [property: string]: HttpRequestParam }) {
    }
}

export class SelectRequestAction implements Action {
    public type = RequestsActionTypes.SELECT_REQUEST;

    constructor(public payload: string) {
    }
}

export class SaveRequestAction implements Action {
    public type = RequestsActionTypes.SAVE_REQUEST;

    constructor(public payload: DefaultHttpRequest) {
    }
}

export class DeleteRequestAction implements Action {
    public type = RequestsActionTypes.DELETE_REQUEST;

    constructor(public payload: string) {
    }
}

export class UpRequestAction implements Action {
    public type = RequestsActionTypes.UP_REQUEST;

    constructor(public payload: string) {
    }
}

export class ResponseReceivedAction implements Action {
    public type = RequestsActionTypes.RESPONSE_RECEIVED;

    constructor(public payload: DefaultHttpResponse) {
    }
}

export class LoadRequestsAction implements Action {
    public type = RequestsActionTypes.LOAD_REQUESTS;

    constructor(public payload?: any) {
    }
}

export class LoadRequestsSuccessAction implements Action {
    public type = RequestsActionTypes.LOAD_REQUESTS_SUCCESS;

    constructor(public payload: DefaultHttpRequest[]) {
    }
}

export class ClearResponseAction implements Action {
    public type = RequestsActionTypes.CLEAR_RESPONSE;

    constructor(public payload: string) {
    }
}
// endregion
